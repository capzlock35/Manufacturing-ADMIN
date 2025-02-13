import React, { useState } from 'react';

const Product = ({ onProductAdd }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add a loading state
  const [imagePreview, setImagePreview] = useState(null); // Store image preview URL

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create a preview URL for the selected image
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !price || !date || !description || !image) {
      setError('Please fill in all fields and select an image.');
      return;
    }

    if (isNaN(price)) {
      setError('Price must be a number.');
      return;
    }

    setIsLoading(true); // Start loading
    setError(''); // Clear any previous errors

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('image', image); // Append the image file

    try {
      const response = await fetch('http://localhost:5000/api/products', { // Replace with your backend URL
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data = await response.json();
      onProductAdd(data.product); // Pass the product data with the Cloudinary image URL

      // Clear the form
      setProductName('');
      setPrice('');
      setDate('');
      setDescription('');
      setImage(null);
      setImagePreview(null); // Clear image preview
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Stop loading (always)
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add New Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            disabled={isLoading} // Disable while loading
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            disabled={isLoading} // Disable while loading
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            disabled={isLoading} // Disable while loading
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            disabled={isLoading} // Disable while loading
          />
        </div>
        <div>
          <label htmlFor="image">Product Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
            disabled={isLoading} // Disable while loading
          />
          {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
        </div>
        <button
          type="submit"
          style={{ backgroundColor: 'blue', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          disabled={isLoading} // Disable while loading
        >
          {isLoading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default Product;