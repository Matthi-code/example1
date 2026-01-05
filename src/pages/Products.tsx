import { useCart, type Product } from '../context/CartContext'

const products: Product[] = [
  { id: 1, name: 'Knuffel Hond Oranje', price: '24,99', image: '/images/DogOrange11-1-scaled.png' },
  { id: 2, name: 'Knuffel Hond Roze', price: '24,99', image: '/images/DogPInk05-scaled.png' },
  { id: 3, name: 'Knuffel Hond Blauw', price: '24,99', image: '/images/DogBlue04-scaled.png' },
  { id: 4, name: 'Knuffel Hond Geel', price: '24,99', image: '/images/DogYelow09-scaled.png' },
  { id: 5, name: 'Knuffel Hond Classic', price: '19,99', image: '/images/DogA01-scaled.png' },
  { id: 6, name: 'Knuffel Honden Set', price: '59,99', image: '/images/Dogs-3c-scaled.png' },
  { id: 7, name: 'Stapelblokken Kubus', price: '14,99', image: '/images/Cube05-scaled.png' },
  { id: 8, name: 'Knuffel Eend & Konijn', price: '29,99', image: '/images/DuckRab03-scaled.png' },
  { id: 9, name: 'Boerderij Speelset', price: '34,99', image: '/images/FarmA04-scaled.png' },
]

function Products() {
  const { addToCart } = useCart()

  return (
    <div className="container">
      <h1>Producten</h1>
      <p className="page-intro">Bekijk ons assortiment</p>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image-img"
            />
            <h3>{product.name}</h3>
            <p className="price">€{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="add-to-cart-btn"
            >
              Voeg toe
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
