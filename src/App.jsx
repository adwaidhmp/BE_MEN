import './App.css'
import {Routes,Route} from "react-router-dom"
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


function App() {
  return (
    <>
    <ToastContainer position="top-center" autoClose={1000} 
    toastClassName={() =>"bg-black text-white font-medium rounded-lg shadow-md p-3" }/>
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
    <OrderProvider>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
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
      </Routes>
      </OrderProvider>
      </CartProvider>
      </WishlistProvider>
      </AuthProvider>
    </>
  )
}

export default App
