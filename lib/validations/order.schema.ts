import { z } from "zod";

const orderStatusEnum = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "CONFIRMED",
]);

const paymentStatusEnum = z.enum(["PENDING", "PAID", "FAILED"]);

const shippingAddressSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().min(1).max(500).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  pincode: z.string().min(1).max(10).optional(),
  phone: z.string().min(1).max(15).optional(),
});

const orderItemSchema = z.object({
  productId: z.string().optional(),
  title: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
  imageUrl: z.string().optional(),
  customization: z
    .object({
      text: z.string().max(500).optional(),
      imageUrl: z.string().url().optional(),
    })
    .optional(),
});

export const createOrderSchema = z.object({
  userId: z.string().optional(),
  userEmail: z.string().email("Valid email is required"),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0, "Total must be non-negative"),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  invoiceUrl: z.string().url().optional(),
  paidAt: z.coerce.date().optional(),
  shippingAddress: shippingAddressSchema.optional(),
});

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});

export const bulkUpdateOrderSchema = z.object({
  orderIds: z.array(z.string()).min(1, "At least one order is required"),
  status: orderStatusEnum.optional(),
  paymentStatus: paymentStatusEnum.optional(),
});
