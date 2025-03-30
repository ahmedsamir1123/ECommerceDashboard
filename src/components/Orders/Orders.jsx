import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🟢 جلب الطلبات من Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        const querySnapshot = await getDocs(ordersRef);
        const ordersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // 🔢 حساب إجمالي السعر للطلب
          const totalPrice = data.products.reduce((sum, product) => {
            return sum + Number(product.price) * Number(product.quantity);
          }, 0);

          return {
            id: doc.id,
            ...data,
            totalPrice,
          };
        });

        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        setError('Failed to fetch orders: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🟠 تغيير حالة الطلب
  const toggleOrderStatus = async (orderId, currentStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { orderStatus: !currentStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: !currentStatus } : order
        )
      );

      setFilteredOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, orderStatus: !currentStatus } : order
        )
      );
    } catch (error) {
      setError('Failed to update order status: ' + error.message);
    }
  };

  // 🔴 حذف الطلب
  const deleteOrder = async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await deleteDoc(orderRef);

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setFilteredOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      setError('Failed to delete order: ' + error.message);
    }
  };

  // 🔍 البحث في الطلبات
  useEffect(() => {
    let filtered = orders;

    if (search) {
      filtered = orders.filter(
        (order) =>
          order.orderId.includes(search) ||
          order.phoneNumber.includes(search) ||
          order.userId.includes(search)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) =>
        filterStatus === 'completed' ? order.orderStatus : !order.orderStatus
      );
    }

    setFilteredOrders(filtered);
  }, [search, filterStatus, orders]);

  if (loading) return <div className="text-center text-xl">Loading orders...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 overflow-x-auto ">
      <h2 className="text-2xl font-bold text-center mb-4">Orders</h2>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search by Order ID, Phone, or User ID"
          className="p-2 border border-gray-400 rounded-lg w-full sm:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border border-gray-400 rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending Orders</option>
          <option value="completed">Completed Orders</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white p-4 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Order ID: {order.id}</h3>
            <p className="text-gray-600">Address: {order.address}</p>
            <p className="text-gray-600">Phone: {order.phoneNumber}</p>
            <p className="text-gray-600">User ID: {order.userId}</p>

            <p className="font-bold text-green-600">Total Price: {order.totalPrice} EGP</p>

            <div className="mt-3">
              <h4 className="text-md font-semibold">Products:</h4>
              {order.products.map((product, index) => (
                <div key={index} className="text-gray-700 text-sm border-b py-2">
                  <p>Product ID: {product.productId}</p>
                  <p>Price: {product.price} EGP</p>
                  <p>Quantity: {product.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="font-bold">
                Status:{' '}
                <span className={order.orderStatus ? 'text-green-600' : 'text-red-600'}>
                  {order.orderStatus ? 'Completed ✅' : 'Pending ⏳'}
                </span>
              </p>

              <button
                onClick={() => toggleOrderStatus(order.id, order.orderStatus)}
                className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {order.orderStatus ? 'Mark as Pending' : 'Mark as Completed'}
              </button>

              <button
                onClick={() => deleteOrder(order.id)}
                className="w-full mt-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Order ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
