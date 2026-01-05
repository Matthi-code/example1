function Products() {
  return (
    <div className="container">
      <h1>Producten</h1>
      <p className="page-intro">Bekijk ons assortiment</p>

      <div className="products-grid">
        <div className="product-card">
          <div className="product-image">🧸</div>
          <h3>Knuffelbeer</h3>
          <p className="price">€19,99</p>
        </div>
        <div className="product-card">
          <div className="product-image">🚗</div>
          <h3>Speelgoedauto</h3>
          <p className="price">€14,99</p>
        </div>
        <div className="product-card">
          <div className="product-image">🎮</div>
          <h3>Spelcomputer</h3>
          <p className="price">€299,99</p>
        </div>
        <div className="product-card">
          <div className="product-image">🧩</div>
          <h3>Puzzel 1000 stukjes</h3>
          <p className="price">€24,99</p>
        </div>
      </div>
    </div>
  )
}

export default Products
