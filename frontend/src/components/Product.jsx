import React, { useState, useEffect } from "react";
import axios from "axios";

const Product = () => {
    const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://backend-admin.jjm-manufacturing.com/api/product'
        : 'http://localhost:7690/api/product';

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        image: null,
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(baseURL);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsSubmitting(true); // Set loading state to true

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post(`${baseURL}/create`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(response.data.message);
            setFormData({
                productName: '',
                description: '',
                price: '',
                image: null,
            });

            // Refresh the product list after successful creation
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(baseURL);
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
            fetchProducts();

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
            console.error("Error creating product:", err);
        } finally {
            setIsSubmitting(false); // Set loading state to false whether success or error
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${baseURL}/${id}`);
            alert(response.data.message);
            // Refresh the product list after successful creation
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(baseURL);
                    setProducts(response.data);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            };
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6">
            <div className="container mx-auto px-4 shadow-md rounded-md bg-white">
                {/* Add Product Form */}
                <div className="mb-8 p-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h2>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    {message && <div className="text-green-500 mb-2">{message}</div>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                id="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm bg-white text-black border-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                id="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm bg-white text-black border-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm bg-white text-black border-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                id="image"
                                onChange={handleImageChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm bg-white text-black border-black focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating..." : "Add Product"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product List Table */}
                <div className="overflow-x-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products List</h2>
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.productName}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.description}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">₱{product.price}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {product.image && product.image.secure_url && (
                                            <img
                                                src={product.image.secure_url}
                                                alt={product.productName}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Product;