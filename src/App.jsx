import './App.css'
import {Routes,Route} from "react-router-dom"
import Homepage from './components/homepage'
import Navbar from './components/navbar'
import Aboutus from './components/Aboutus'
import ProductDetails from './components/ProductDetails'
function App() {
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/product/:id' element={<ProductDetails/>}/>
        <Route path='/about' element={<Aboutus/>}/>
      </Routes>
    </>
  )
}

export default App
