import React, { useState } from 'react';

function EditProduct(props) {
  // product -> the intial product object passed in
  // onSave -> a function that will be called when the user clicks the Save button
  // onCancel ->  a function that will be called when the user clicks the Cancel button
  // updateProduct -> a function that will be called when the product is updated
  // productID -> the ID of the product currently being edited
  // onDelete -> a function that will be called when the user clicks the Delete button
  const { product, onSave, onCancel, updateProduct, productID, onDelete } = props;

  const [editedProduct, setEditedProduct] = useState(product);

  function handleInputChange(event) { // Update editedProduct in response to changes in the input fields of the editing form
    const { name, value } = event.target; // Extract name and value, use `setEditedProduct` to update editedProduct with new values
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "developer_names"
          ? value.split(",").map((devName) => devName.trim()) // If name is developer_names, value is split by comma
          : value,
    }));
  }  

  async function handleSaveClick() {
    try { // Send a PUT request to the API
      const response = await fetch(`http://localhost:8000/products/${productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProduct)
      });

      if (response.ok) { // If the reponse status is 200 OK, then the data is retrieved using the json() method
        const updatedProduct = await response.json();
        onSave(updatedProduct);
        updateProduct(updatedProduct);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) { // If not 200 OK, throw an error
      console.error(error);
    }
  }

  async function handleDeleteClick() { // Send a DELETE request to the server to delete the product with the specified productID
    try {
      const response = await fetch(`http://localhost:8000/products/${productID}`, {
        method: 'DELETE',
      });
  
      if (response.ok) { // If 200 OK, onDelete gets passed in and removes the product; setEditedProduct is called to reset the state variable
        onDelete(productID);
        setEditedProduct(null);
      } else if (response.status === 404) {
        throw new Error("Product not found");
      } else { // If status is neither one of the above, throw a message retrived from the response body
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
    }
  }  

  function handleCancelClick() {
    onCancel(); // Simply call onCancel to remove any changes made and reset the UI to its previous state
  }

  if (!editedProduct) {
    return null; // Prevent re-rendering
  }

  return (
    <tr>
      <td>
        <input type="text" name="product_number" value={editedProduct.id} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="product_name" value={editedProduct.product_name} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="scrum_master" value={editedProduct.scrum_master} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="product_owner" value={editedProduct.product_owner} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="developer_names" value={editedProduct.developer_names.join(', ')} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="start_date" value={editedProduct.start_date} onChange={handleInputChange} />
      </td>
      <td>
        <input type="text" name="methodology" value={editedProduct.methodology} onChange={handleInputChange} />
      </td>
      <td>
        <button onClick={handleSaveClick}>Save</button>
        <button onClick={handleCancelClick}>Cancel</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </td>
    </tr>
  );
}

export default EditProduct;
