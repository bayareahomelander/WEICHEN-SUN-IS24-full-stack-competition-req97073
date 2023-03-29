import React, {useState} from 'react';
import ProductList from './components/ProductList';
import EditProduct from './components/EditProduct';

function App() {
  const [products, setProducts] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  
  return (
    <div>
      <ProductList products={products} />
    </div>
  );
}

export default App; 