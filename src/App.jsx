import './App.css'
import {Routes,Route} from "react-router-dom"
import Homepage from './components/homepage'
import Navbar from './components/navbar'
import Aboutus from './components/Aboutus'
import ProductDetails from './components/ProductDetails'
import Wishlist from './components/wishlist'
import { Wishlistprovider } from './components/contexts/wishlistcontext'
import { CartProvider } from './components/contexts/cartcontext'
import Cart from './components/cart'
import { OrderProvider } from './components/contexts/ordercontext'
import Orders from './components/Orders'
import Login from './components/login'
import Profile from './components/profile'
import Signup from './components/signup'
import { AuthProvider } from './components/contexts/Authcontext'
function App() {
  return (
    <>
    <AuthProvider>
    <Wishlistprovider>
    <CartProvider>
    <OrderProvider>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>
        <Route path='/about' element={<Aboutus/>}/>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      </OrderProvider>
      </CartProvider>
      </Wishlistprovider>
      </AuthProvider>
    </>
  )
}

export default App
