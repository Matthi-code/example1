import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Menu() {
  const { totalItems } = useCart()

  return (
    <header className="header">
      <nav className="menu">
        <NavLink to="/" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
          Home
        </NavLink>
        <NavLink to="/producten" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
          Producten
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>
          Contact
        </NavLink>
        <NavLink to="/winkelwagen" className={({ isActive }) => `menu-link cart-link ${isActive ? 'active' : ''}`}>
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </NavLink>
      </nav>
    </header>
  )
}

export default Menu
