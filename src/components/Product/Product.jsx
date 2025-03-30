import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // جلب المنتجات من Firestore عند تحميل المكون
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const querySnapshot = await getDocs(productsRef);
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
        setFilteredProducts(productsList);
      } catch (error) {
        setError('Failed to fetch products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.pName.toLowerCase().includes(value.toLowerCase()) ||
          product.id.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleDelete = async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      setProducts(products.filter((product) => product.id !== productId));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
    } catch (error) {
      setError('Failed to delete product: ' + error.message);
    }
  };

  const handlePriceChange = async (productId, newPrice) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { price: newPrice });
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, price: newPrice } : product
        )
      );
      setFilteredProducts(
        filteredProducts.map((product) =>
          product.id === productId ? { ...product, price: newPrice } : product
        )
      );
    } catch (error) {
      setError('Failed to update price: ' + error.message);
    }
  };

  const handleStockChange = async (productId, action) => {
    const product = products.find((product) => product.id === productId);
    const newStock = action === 'increase' ? product.stock + 1 : product.stock - 1;

    if (newStock < 0) return; 

    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { stock: newStock });
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
      setFilteredProducts(
        filteredProducts.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (error) {
      setError('Failed to update stock: ' + error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Search by product name or ID"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.pName}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>

            <p className="text-gray-500 text-sm mb-2">ID: {product.id}</p>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-blue-600">{product.price} EGP</span>
              <span className="text-sm text-gray-500">In stock: {product.stock}</span>
            </div>

            <div className="mb-4">
              <input
                type="number"
                value={product.price}
                onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value))}
                className="p-2 border border-gray-300 rounded-md"
                placeholder="Update price"
              />
            </div>

            <div className="flex items-center mb-4">
              <button
                onClick={() => handleStockChange(product.id, 'increase')}
                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Increase Stock
              </button>
              <button
                onClick={() => handleStockChange(product.id, 'decrease')}
                className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Decrease Stock
              </button>
            </div>

            <button
              onClick={() => handleDelete(product.id)}
              className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
