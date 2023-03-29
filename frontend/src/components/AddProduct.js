import React, { useState, useEffect } from 'react';

const AddProduct = ({ onAddProduct }) => {
  const [product, setProduct] = useState({
    product_name: '',
    scrum_master: '',
    product_owner: '',
    developer_names: '',
    start_date: '',
    methodology: ''
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all fields are filled out
    for (const key in product) {
      if (product[key] === '') {
        alert('Please fill out all fields');
        return;
      }
    }

    const newProduct = {
      ...product,
      id: generateProductNumber(),
      developer_names: product.developer_names.split(",").map(name => name.trim())
    };

    try {
      const response = await fetch('http://localhost:8000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      console.log(data);
      setProducts([...products, data]);
      onAddProduct(data);
      setProduct({
        id: '',
        product_name: '',
        scrum_master: '',
        product_owner: '',
        developer_names: '',
        start_date: '',
        methodology: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const generateProductNumber = () => {
    const min = 1000;
    const max = 9999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber.toString();
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <label htmlFor="product_name">Product Name:</label>
      <input type="text" name="product_name" value={product.product_name} onChange={handleChange} />

      <label htmlFor="scrum_master">Scrum Master:</label>
      <input type="text" name="scrum_master" value={product.scrum_master} onChange={handleChange} />

      <label htmlFor="product_owner">Product Owner:</label>
      <input type="text" name="product_owner" value={product.product_owner} onChange={handleChange} />

      <label htmlFor="developer_names">Developer Names:</label>
      <input type="text" name="developer_names" value={product.developer_names} onChange={handleChange} />

      <label htmlFor="start_date">Start Date:</label>
      <input type="text" name="start_date" value={product.start_date} onChange={handleChange} />

      <label htmlFor="methodology">Methodology:</label>
      <select name="methodology" value={product.methodology} onChange={handleChange}>
        <option value=""></option>
        <option value="Agile">Agile</option>
        <option value="Waterfall">Waterfall</option>
      </select>

      <input type="submit" value="Save and Add" />
    </form>
  );
};

export default AddProduct;