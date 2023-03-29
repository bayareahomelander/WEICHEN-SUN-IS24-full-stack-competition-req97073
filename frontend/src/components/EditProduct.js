import React, { useState } from 'react';

function EditProduct(props) {
  const { product, onSave, onCancel, updateProduct, productID, onDelete } = props;

  const [editedProduct, setEditedProduct] = useState(product);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]:
        name === "developer_names"
          ? value.split(",").map((devName) => devName.trim())
          : value,
    }));
  }  

  async function handleSaveClick() {
    try {
      const response = await fetch(`http://localhost:8000/products/${productID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProduct)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSave(updatedProduct);
        updateProduct(updatedProduct);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      // Display an error message to the user
    }
  }

  async function handleDeleteClick() {
    try {
      const response = await fetch(`http://localhost:8000/products/${productID}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        onDelete(productID);
        setEditedProduct(null);
      } else if (response.status === 404) {
        throw new Error("Product not found");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error(error);
      // Display an error message to the user
    }
  }  

  function handleCancelClick() {
    onCancel();
  }

  if (!editedProduct) {
    return null; // don't render anything if row is deleted
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
