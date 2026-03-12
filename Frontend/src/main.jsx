import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css';
import Nav from './Navbar.jsx'
import Section_1 from './Section_1.jsx';
import Section_2 from './Section_2.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Adminpenal from './adminpenal.jsx';
import Adminlogin from './Adminlogin.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Profile from './UserDasbord.jsx';
import { CardProviderd } from './CartContext.jsx';
import Cart from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import OrderConfirmation from './OrderConfirmation.jsx';
import Footer from './Footer.jsx';
import AdminLayout from './Adminlayout.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CardProviderd>
      <BrowserRouter>
        <Nav />

        <Routes>
          <Route path="/adminlogin" element={<Adminlogin />} />
          
          <Route path='/addfood' element={
            <ProtectedRoute>
              <Adminpenal />
              
            </ProtectedRoute>

          } />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/Profile' element={<Profile />} />
          {/* added a duplicate route so '/orders' also loads the dashboard (same component) */}
          <Route path='/orders' element={<Profile />} />
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
          <Route path='/order-confirmation' element={<OrderConfirmation/>}/>
          <Route path="/" element={<>

            <Section_1 />
            <Section_2 />
            <Footer/>


          </>} />


        </Routes>













      </BrowserRouter>

    </CardProviderd>
  </StrictMode>,
)
