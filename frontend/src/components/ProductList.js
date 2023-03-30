import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

function ProductList() {
   // State variable intialized to an empty array, will be used to store a list of product objects
  const [products, setProducts] = useState([]);
  
  // State variable intialized to `null`, will be used to keep track of the product being edited
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State variable intialized to `0`, will be used to keep track of the total number of products
  const [totalProducts, setTotalProducts] = useState(0);
  
  // State variable intialized to `0`, will be used to total number of products in which has a Scrum Master in it
  const [totalScrumMaster, setTotalScrumMaster] = useState(0);
  
  // State variable intialized to an empty string, will be used to store current search query for filtering
  const [searchQuery, setSearchQuery] = useState('');
  
  // State variable intialized to an empty string, will be used to store for filtering developer names
  const [developerSearchQuery, setDeveloperSearchQuery] = useState('');


  useEffect(() => {
    // Send a GET request to the API to retrieve a list of product objects in JSON format
    fetch('http://localhost:3000/api/products', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Retrieved data is then passed to the state variable using their corresponding setter functions
        setProducts(data);
        setTotalProducts(data.length);
        setTotalScrumMaster(data.filter(product => product.scrum_master !== 'n/a').length);
      });
  }, []);

  useEffect(() => {
    setTotalScrumMaster(products.filter(product => product.scrum_master !== 'n/a').length);
  }, [products]);

  // Take a newProduct object as input and add the input to the products state array, also increment the totalProducts state variable by 1
  function handleAddProduct(newProduct) {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setTotalProducts(prevTotalProducts => prevTotalProducts + 1);
  }

  // Take a product object as input and set it as the editingProduct state variable
  function handleEditClick(product) {
    setEditingProduct(product);
  }

  // Cancel any ongoing product editing
  function handleEditCancel() {
    setEditingProduct(null);
  }

  // Handle the saving of edited product data, update corresponding state variables, and re-render the component to reflect the changes
  function handleEditSave(editedProduct) {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === editedProduct.id ? editedProduct : product
      )
    );
  
    // Set the editingProduct state variable to null, effectively canceling any ongoing product editing
    setEditingProduct(null);
  
    // Update Scrum Master count
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

  // Take an event object as input (triggered by a change in search bar), update `searchQuery` with the value of the input field
  function handleSearchQueryChange(event) {
    setSearchQuery(event.target.value);
  }

  function handleDeleteProduct(deletedProductId) {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== deletedProductId));
  }  

  // Check if each product object has a scrum_master/developer_names value that includes the searchQuery value and re-render the table
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
                /> // Generate a table of filtered elements, with an editing form when Edit button is clicked. Once submitted, the new data is then saved to the server and the component is re-rendered.
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
