import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import { Provider } from "react-redux";
import Store from './redux/store'
import Register from './components/Register/Register'
import AddProduct from './components/AddProduct/AddProduct'
import Product from './components/Product/Product'
import Orders from './components/Orders/Orders'
import Inbox from './components/Inbox/Inbox'
import SecurtyUrl from './components/SecurtyUrl/SecurtyUrl'
import Users from './components/Users/Users'


const router = createBrowserRouter([{
  path: '/', element: <Layout />, children: [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/', element: <SecurtyUrl element={<Home />} /> },

    { path: '/addProduct', element: <SecurtyUrl element={<AddProduct />} /> },
    { path: '/product', element: <SecurtyUrl element={<Product />} /> },
    { path: '/order', element: <SecurtyUrl element={<Orders />} /> },
    { path: '/inbox', element: <SecurtyUrl element={<Inbox />} /> },
    { path: '/users', element: <SecurtyUrl element={<Users />} /> },


  ]
},
{ path: "*", element: <>Errorrrrrrrrrrr</> }
])

function App() {

  return (
    <>
      <Provider store={Store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
