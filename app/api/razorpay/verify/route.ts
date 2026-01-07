import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RAZORPAY_KEY_SECRET } from '@/lib/razorpayConfig';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import { sendEmailNotification, sendTelegramNotification } from '@/lib/notificationUtils';
import cloudinary from '@/lib/cloudinary';
import PDFDocument from 'pdfkit';

// Helper to generate PDF Buffer
async function generateInvoicePDF(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: any[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // --- Header ---
        doc.fontSize(24).font('Helvetica-Bold').text('Tuhfina Creation', { align: 'center' });
        doc.fontSize(10).font('Helvetica').text('Luxury & Elegance', { align: 'center' });
        doc.moveDown();
        doc.moveDown();

        // --- Invoice Details ---
        doc.fontSize(20).text('INVOICE', { align: 'left' });
        doc.moveDown(0.5);

        const invoiceDate = new Date().toLocaleDateString();
        doc.fontSize(10).text(`Invoice Number: INV-${order._id.toString().substring(0, 8).toUpperCase()}`);
        doc.text(`Date: ${invoiceDate}`);
        doc.text(`Order ID: ${order._id}`);
        doc.moveDown();

        // --- Bill To ---
        doc.text('Bill To:', { underline: true });
        doc.text(order.shippingAddress.name);
        doc.text(order.shippingAddress.address);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`);
        doc.text(`Phone: ${order.shippingAddress.phone}`);
        doc.moveDown(2);

        // --- Table Header ---
        const tableTop = doc.y;
        const itemX = 50;
        const qtyX = 350;
        const priceX = 450;

        doc.font('Helvetica-Bold');
        doc.text('Item Description', itemX, tableTop);
        doc.text('Qty', qtyX, tableTop);
        doc.text('Price', priceX, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        let y = tableTop + 25;
        doc.font('Helvetica');

        // --- Items ---
        order.items.forEach((item: any) => {
            doc.text(item.title, itemX, y, { width: 280 });
            doc.text(item.quantity.toString(), qtyX, y);
            doc.text(`INR ${item.price}`, priceX, y);
            y += 20;
        });

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

        // --- Total ---
        y += 20;
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`Total Amount: INR ${order.totalAmount}`, 350, y, { align: 'right', width: 200 });

        doc.end();
    });
}

const uploadToCloudinary = (buffer: Buffer, orderId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'invoices',
                public_id: `invoice_${orderId}`,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result!.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
};

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = await request.json();

        // 1. SECURE SIGNATURE VERIFICATION
        // It is CRITICAL to verify the signature on the server side to prevent
        // malicious users from spoofing successful payments.
        // The signature is a HMAC-SHA256 hash of (order_id + "|" + payment_id) 
        // using the Razorpay Key Secret.
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            console.error('Invalid Razorpay signature detected');
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
        }

        // 2. Connect to DB and Fetch Order
        await dbConnect();
        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json({ error: 'Order not found in database' }, { status: 404 });
        }

        // 3. IDEMPOTENCY CHECK
        // If the order is already marked as PAID, we don't need to process it again.
        // This handles cases where a user might refresh the page or the webhook/frontend
        // both trigger verification.
        if (order.paymentStatus === 'PAID') {
            return NextResponse.json({
                success: true,
                message: 'Order already verified',
                invoiceUrl: order.invoiceUrl
            });
        }

        // 4. GENERATE INVOICE
        // We generate the invoice only AFTER signature verification.
        let downloadURL = order.invoiceUrl;
        try {
            const pdfBuffer = await generateInvoicePDF(order);
            downloadURL = await uploadToCloudinary(pdfBuffer, orderId);
        } catch (invoiceError) {
            console.error('Invoice generation/upload failed:', invoiceError);
            // We continue even if invoice fails, as payment is successful.
            // Admin can generate invoice manually later if needed.
        }

        // 5. UPDATE ORDER STATUS
        // We update the order in MongoDB with the payment details and set statuses.
        // paymentStatus = "PAID"
        // status = "CONFIRMED" (as requested by user)
        order.paymentStatus = 'PAID';
        order.status = 'CONFIRMED';
        order.razorpayOrderId = razorpay_order_id;
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.invoiceUrl = downloadURL;
        order.paidAt = new Date();

        await order.save();

        // 6. ADMIN NOTIFICATIONS
        // We trigger notifications only after successful order save.
        // This is async and non-blocking for the payment verification process.
        try {
            const existingNotification = await Notification.findOne({ orderId: order._id });
            if (!existingNotification) {
                await Notification.create({
                    type: 'NEW_ORDER',
                    title: 'New Order Received',
                    message: `Order #${order._id.toString().substring(0, 8)} paid successfully`,
                    orderId: order._id,
                    isRead: false
                });

                // Fire and forget (non-blocking)
                sendEmailNotification(order).catch(err => console.error('Email notify error:', err));
                sendTelegramNotification(order).catch(err => console.error('Telegram notify error:', err));
            }
        } catch (notifError) {
            console.error('Notification system error:', notifError);
            // We do NOT block the response if notifications fail.
        }

        console.log(`Order ${orderId} successfully verified and marked as PAID/CONFIRMED`);

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            invoiceUrl: downloadURL
        });

    } catch (error: any) {
        console.error('Payment verification system error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error during verification'
        }, { status: 500 });
    }
}
