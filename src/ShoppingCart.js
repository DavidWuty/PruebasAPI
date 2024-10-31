// ShoppingCart.js
import React, { useState } from 'react';
import axios from 'axios';
import './ShoppingCart.css';

function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  
  // Función para agregar productos al carrito
  const addToCart = () => {
    if (productName && productPrice) {
      const product = { name: productName, price: parseFloat(productPrice) };
      setCart([...cart, product]);
      setProductName('');
      setProductPrice('');
    } else {
      alert('Por favor ingresa nombre y precio del producto.');
    }
  };

  // Función para guardar el carrito en GitHub
  const saveCartToGitHub = async () => {
    const repo = "DavidWuty/PruebasAPI";
    const path = "carrito.json";
    const message = "Guardar carrito";
    const content = btoa(JSON.stringify(cart, null, 2));

    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/${repo}/contents/${path}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sha = data.sha;

      await axios.put(
        `https://api.github.com/repos/${repo}/contents/${path}`,
        { message, content, sha },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("¡Carrito guardado en GitHub!");

    } catch (error) {
      if (error.response && error.response.status === 404) {
        await axios.put(
          `https://api.github.com/repos/${repo}/contents/${path}`,
          { message, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("¡Carrito guardado en GitHub!");
      } else {
        console.error("Error al guardar el carrito:", error);
        alert("Hubo un error al guardar el carrito.");
      }
    }
  };

  return (
    <div className="shopping-cart">
      <h2>Carrito de Compras</h2>
      <div className="add-product">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <button onClick={addToCart}>Agregar Producto</button>
      </div>
      <ul className="cart-list">
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <button className="save-button" onClick={saveCartToGitHub}>Guardar carrito en GitHub</button>
    </div>
  );
}

export default ShoppingCart;
