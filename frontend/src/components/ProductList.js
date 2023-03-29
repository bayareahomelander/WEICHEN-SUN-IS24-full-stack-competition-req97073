import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalScrumMaster, setTotalScrumMaster] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [developerSearchQuery, setDeveloperSearchQuery] = useState('');


  useEffect(() => {
    fetch('http://localhost:8000/products', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setTotalProducts(data.length);
        setTotalScrumMaster(data.filter(product => product.scrum_master !== 'n/a').length);
      });
  }, []);

  useEffect(() => {
    setTotalScrumMaster(products.filter(product => product.scrum_master !== 'n/a').length);
  }, [products]);

  function handleAddProduct(newProduct) {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setTotalProducts(prevTotalProducts => prevTotalProducts + 1);
  }

  function handleEditClick(product) {
    setEditingProduct(product);
  }

  function handleEditCancel() {
    setEditingProduct(null);
  }

  function handleEditSave(editedProduct) {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
  
    setEditingProduct(null);
  
    setTotalScrumMaster(prevTotalScrumMaster => {
      const changedProduct = products.find(
        product => product.id === editedProduct.id
      );
      if (changedProduct && changedProduct.scrum_master !== editedProduct.scrum_master) {
        if (changedProduct.scrum_master !== 'n/a') {
          return prevTotalScrumMaster - 1;
        } else if (editedProduct.scrum_master !== 'n/a') {
          return prevTotalScrumMaster + 1;
        }
      }
      return prevTotalScrumMaster;
    });
  }  

  function handleSearchQueryChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleDeleteProduct(deletedProductId) {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== deletedProductId));
  }  

  const filteredProducts = products.filter(
    (product) =>
      product.scrum_master.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.developer_names.some((dev) =>
        dev.toLowerCase().includes(developerSearchQuery.toLowerCase())
      )
  );  

  function handleDeveloperSearchQueryChange(event) {
    setDeveloperSearchQuery(event.target.value);
  }
  

  return (
    <div>
      <h1>Product List</h1>
      <p>Total number of products: {totalProducts}</p>
      <p>Total number of products with Scrum Master: {totalScrumMaster}</p>
      <p>Total number of products with searched Scrum Master: {searchQuery ? filteredProducts.length : 0}</p>
      <p>Total number of products with searched Developer:{" "} {developerSearchQuery ? filteredProducts.length : 0}</p>
      <input type="text" placeholder="Search by Scrum Master" value={searchQuery} onChange={handleSearchQueryChange}/>
      <input type="text" placeholder="Search by Developer" value={developerSearchQuery} onChange={handleDeveloperSearchQueryChange}/>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product Number</th>
            <th>Product Name</th>
            <th>Scrum Master</th>
            <th>Product Owner</th>
            <th>Developer Names</th>
            <th>Start Date</th>
            <th>Methodology</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <React.Fragment key={product.id}>
              {editingProduct && editingProduct.id === product.id ? (
                  <EditProduct
                  product={product}
                  onSave={handleEditSave}
                  onCancel={handleEditCancel}
                  onDelete={handleDeleteProduct}
                  productID = {product.id}
                />
              ) : (
                <tr>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.scrum_master}</td>
                  <td>{product.product_owner}</td>
                  <td>{product.developer_names.join(', ')}</td>
                  <td>{product.start_date}</td>
                  <td>{product.methodology}</td>
                  <td>
                    <button onClick={() => handleEditClick(product)}>Edit</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <AddProduct onAddProduct={handleAddProduct} />
    </div>
  );
}

export default ProductList;