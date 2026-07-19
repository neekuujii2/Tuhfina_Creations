'use client';

import { Order } from '@/lib/types';

interface OrderRowProps {
    order: Order;
    onStatusChange: (orderId: string, status: Order['status']) => void;
}

export function OrderRow({ order, onStatusChange }: OrderRowProps) {
    return (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-border pb-5 mb-5">
                <div>
                    <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">Order Summary</p>
                    <h3 className="font-mono text-sm text-primary font-bold">{order.id}</h3>
                    <p className="text-xs text-text-secondary mt-1">
                        Email: {order.userEmail} | Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Value</p>
                        <p className="text-xl font-bold text-[#d4af37]">₹{order.totalAmount}</p>
                    </div>
                    <select
                        value={order.status}
                        onChange={(e) =>
                            onStatusChange(order.id, e.target.value as Order['status'])
                        }
                        className="bg-surface border border-border rounded-full text-xs font-bold px-4 py-2 outline-none focus:border-accent"
                    >
                        <option value="pending">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Purchased Items</h4>
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs border-b border-border/40 pb-2">
                                <span className="font-medium text-primary">
                                    {item.title} <span className="text-text-secondary">× {item.quantity}</span>
                                    {item.customization && (
                                        <span className="block text-[10px] font-bold text-accent">✨ Customized</span>
                                    )}
                                </span>
                                <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Shipping Address</h4>
                    {order.shippingAddress ? (
                        <p className="text-xs text-text-secondary leading-relaxed">
                            <strong className="text-primary">{order.shippingAddress.name}</strong>
                            <br />
                            {order.shippingAddress.address}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            <br />
                            Phone: {order.shippingAddress.phone}
                        </p>
                    ) : (
                        <p className="text-xs text-text-secondary italic">No address provided</p>
                    )}
                </div>

                <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-text-secondary mb-3">Payments</h4>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Status:</span>
                            <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {order.paymentStatus || 'PENDING'}
                            </span>
                        </div>
                        {order.razorpayPaymentId && (
                            <div className="flex justify-between text-xs">
                                <span>Payment ID:</span>
                                <span className="font-mono text-primary">{order.razorpayPaymentId}</span>
                            </div>
                        )}
                        {order.invoiceUrl && (
                            <div className="pt-2">
                                <a
                                    href={order.invoiceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline text-xs font-bold flex items-center gap-1"
                                >
                                    Download PDF Invoice
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}