import { NavLink } from 'react-router-dom'

function Menu() {
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
      </nav>
    </header>
  )
}

export default Menu
