import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { RAZORPAY_KEY_SECRET } from '@/lib/razorpayConfig';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
        doc.fontSize(10).text(`Invoice Number: INV-${order.id.substring(0, 8).toUpperCase()}`);
        doc.text(`Date: ${invoiceDate}`);
        doc.text(`Order ID: ${order.id}`);
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
            y += 20; // Adjust for dynamic height if needed
        });

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

        // --- Total ---
        y += 20;
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text(`Total Amount: INR ${order.totalAmount}`, 350, y, { align: 'right', width: 200 }); // Align right essentially

        doc.end();
    });
}

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = await request.json();

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // 2. Fetch Order Data
            const orderRef = doc(db, 'orders', orderId);
            const orderSnap = await getDoc(orderRef);

            if (!orderSnap.exists()) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            const orderData = orderSnap.data();

            // 3. Generate PDF
            const pdfBuffer = await generateInvoicePDF({ id: orderId, ...orderData });

            // 4. Upload to Storage
            // Note: Using client SDK server-side. Ensure rules allow write.
            const storageRef = ref(storage, `invoices/${orderId}.pdf`);

            // Convert Buffer to Uint8Array for clean uploadBytes compatibility
            const uint8Array = new Uint8Array(pdfBuffer);

            await uploadBytes(storageRef, uint8Array, { contentType: 'application/pdf' });
            const downloadURL = await getDownloadURL(storageRef);

            // 5. Update Order in Firestore
            await updateDoc(orderRef, {
                paymentStatus: 'PAID',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                invoiceUrl: downloadURL,
                status: 'processing', // Auto-move to processing
                paidAt: new Date()
            });

            return NextResponse.json({ success: true, invoiceUrl: downloadURL });
        } else {
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
        }
    } catch (error) {
        console.error('Payment verification failed:', error);
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
    }
}
