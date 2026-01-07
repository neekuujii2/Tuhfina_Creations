'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/lib/types';
import { Package, User, CheckCircle } from 'lucide-react';

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get('orderSuccess');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userOrders = await orderService.getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user === null && !loading) {
      router.push('/login');
      return;
    }

    if (isAdmin) {
      router.push('/admin');
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, isAdmin, loadOrders, router]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        {orderSuccess && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-fade-in">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                Order Placed Successfully!
              </h3>
              <p className="text-green-700">
                Thank you for your order. We&apos;ll send you updates about your order status.

              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-luxury-black mb-2">
            My Dashboard
          </h1>
          <p className="text-luxury-gray">Welcome back, {user?.email}</p>
        </div>

        {/* User Info Card */}
        <div className="bg-luxury-cream rounded-lg p-8 mb-12">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white rounded-full">
              <User className="text-luxury-gold" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-semibold text-luxury-black">
                Profile Information
              </h2>
              <p className="text-luxury-gray mt-1">{user?.email}</p>
              <p className="text-sm text-luxury-gray mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}

              </p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <Package className="text-luxury-gold" size={28} />
            <h2 className="text-3xl font-serif font-bold text-luxury-black">
              My Orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-luxury-cream rounded-lg">
              <Package className="mx-auto text-luxury-gray mb-4" size={64} />
              <h3 className="text-2xl font-serif font-semibold text-luxury-black mb-2">
                No orders yet
              </h3>
              <p className="text-luxury-gray mb-6">
                Start shopping to see your orders here
              </p>
              <button
                onClick={() => router.push('/shop')}
                className="btn-luxury"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 card-hover"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-sm text-luxury-gray mb-1">
                        Order ID: <span className="font-mono">{order.id}</span>
                      </p>
                      <p className="text-sm text-luxury-gray">
                        Placed on {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xl font-bold text-luxury-gold">
                          ₹{order.totalAmount}
                        </span>
                        {order.invoiceUrl && (
                          <a
                            href={order.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-luxury-black hover:text-luxury-gold underline"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                            Download Invoice
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🎁
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-luxury-black">
                            {item.title}
                          </h4>
                          <p className="text-sm text-luxury-gray">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                          {item.customization && (
                            <p className="text-xs text-luxury-gold mt-1">
                              ✨ Customized
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-luxury-black mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-luxury-gray">
                        {order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                        {order.shippingAddress.pincode}
                        <br />
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-luxury-gold border-t-transparent"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
