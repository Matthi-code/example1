import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Menu from './components/Menu'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Menu />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producten" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/winkelwagen" element={<Cart />} />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
