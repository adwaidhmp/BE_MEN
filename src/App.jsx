import './App.css'
import {Routes,Route, useLocation} from "react-router-dom"
import { lazy, Suspense } from "react";
import Loader from './components/Loader';
const Homepage = lazy(() => import('./components/homepage'));
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
import LoginRoute from './components/Routes/Loginroute'
import ProtectedRoute from './components/Routes/protectedroutes'
import Contact from './components/contact'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from './components/Routes/AdminRoute'
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard =lazy(()=>import( './components/admin/Dashboard'));
const Users =lazy(()=>import ('./components/admin/Admuser'));
const AdmOrders =lazy(()=>import ( './components/admin/Admorders'))
const Products =lazy(()=>import ( './components/admin/Admproducts'))
const Feedback =lazy(()=>import ( './components/admin/Feedback'));
import NotFound from './components/Notfound'
import Landing from './components/Landing'


function App() {
 
const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin")|| location.pathname === "/"
  || location.pathname === "/login"|| location.pathname === "/signup";
  return (
    <>
    
    <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} 
     closeOnClick pauseOnHover draggable toastClassName="!bg-black  !text-white font-medium rounded-full shadow-md p-3"
     bodyClassName="text-white "/>
    <AuthProvider>
    <WishlistProvider>
    <CartProvider>
    <OrderProvider>
    {!isAdminRoute && <Navbar />}
      <Routes>
      <Route path='/admin' element={ <Suspense fallback={<Loader />}> <AdminRoute><AdminLayout /></AdminRoute> </Suspense>}>
        <Route index element={<Suspense fallback={<Loader />}> <Dashboard /> </Suspense>} />
        <Route path="users" element={<Suspense fallback={<Loader />}> <Users /> </Suspense>} />
        <Route path="orders" element={<Suspense fallback={<Loader />}> <AdmOrders /></Suspense>} />
        <Route path="products" element={<Suspense fallback={<Loader />}> <Products /></Suspense>} />
        <Route path="feedback" element={<Suspense fallback={<Loader />}> <Feedback /></Suspense>} />
        </Route>
        <Route path='/home' element={ <Suspense fallback={<Loader />}> <Homepage /> </Suspense>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>
        <Route path='/about' element={<Aboutus/>}/>
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute> } />
        <Route path='/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute> } />
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
