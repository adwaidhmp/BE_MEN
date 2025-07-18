import './App.css'
import {Routes,Route, useLocation} from "react-router-dom"
import Homepage from './components/homepage'
import Navbar from './components/navbar'
import Aboutus from './components/Aboutus'
import ProductDetails from './components/ProductDetails'
import Wishlist from './components/wishlist'
import { WishlistProvider } from './components/contexts/wishlistcontext'
import { CartProvider } from './components/contexts/cartcontext'
import Cart from './components/cart'
import { OrderProvider } from './components/contexts/ordercontext'
import Orders from './components/Orders'
import Login from './components/login'
import Profile from './components/profile'
import Signup from './components/signup'
import { AuthProvider } from './components/contexts/Authcontext'
import Payment from './components/payment'
import LoginRoute from './components/contexts/Loginroute'
import ProtectedRoute from './components/contexts/protectedroutes'
import Contact from './components/contact'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from './components/admin/AdminRoute'
import Dashboard from './components/admin/Dashboard'
import Users from './components/admin/Admuser'
import AdmOrders from './components/admin/Admorders'
import Products from './components/admin/Admproducts'
import AdminLayout from './components/admin/AdminLayout'
import NotFound from './components/Notfound'
import Landing from './components/Landing'


function App() {
const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin")|| location.pathname === "/";
  return (
    <>
    <ToastContainer position="top-center" autoClose={1000} 
    toastClassName={() =>"bg-black text-white font-medium rounded-lg shadow-md p-3" }/>
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
    <OrderProvider>
    {!isAdminRoute && <Navbar />}
      <Routes>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="orders" element={<AdmOrders />} />
        <Route path="products" element={<Products />} />
        </Route>
        <Route path='/home' element={<Homepage/>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>
        <Route path='/about' element={<Aboutus/>}/>
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute> } />
        <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
        <Route path="/signup" element={<LoginRoute> <Signup /></LoginRoute> } />
        <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="*" element={<NotFound/>} />
        <Route path="/" element={<Landing/>}/>
      </Routes>
      </OrderProvider>
      </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </>
  )
}

export default App
