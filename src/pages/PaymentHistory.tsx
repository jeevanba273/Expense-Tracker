import React from 'react';
import { Download, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/helpers';
import { supabase } from '../lib/supabase';

const PaymentHistory: React.FC = () => {
  const { userPreferences } = useApp();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('stripe_user_orders')
          .select('*')
          .order('order_date', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadInvoice = async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-invoice`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${paymentIntentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No payments yet</h3>
            <p className="text-gray-500">
              Your payment history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(order.order_date).toLocaleDateString(userPreferences.locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800">
                        Pro Plan Subscription
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.payment_intent_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {formatCurrency(order.amount_total / 100, userPreferences.currency, userPreferences.locale)}
                    </td>
                    <td className="px-6 py-4">
                      {order.payment_status === 'succeeded' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Paid
                        </span>
                      ) : order.payment_status === 'failed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                          <XCircle size={12} className="mr-1" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {order.payment_status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.payment_status === 'succeeded' && (
                        <button
                          onClick={() => downloadInvoice(order.payment_intent_id)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                        >
                          <Download size={16} className="mr-1" />
                          Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;