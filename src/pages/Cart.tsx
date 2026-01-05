import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="container">
        <h1>Winkelwagen</h1>
        <div className="cart-empty">
          <p>Je winkelwagen is leeg</p>
          <Link to="/producten" className="btn-primary">
            Bekijk producten
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Winkelwagen</h1>

      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-price">€{item.price}</p>
            </div>
            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="qty-btn"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="qty-btn"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Verwijder
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Totaal:</span>
          <span className="total-price">€{totalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="cart-actions">
          <button onClick={clearCart} className="btn-secondary">
            Leeg winkelwagen
          </button>
          <button className="btn-primary">
            Afrekenen
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
