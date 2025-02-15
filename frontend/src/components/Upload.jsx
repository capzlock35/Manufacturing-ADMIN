// src/components/Upload.jsx
import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:7690/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(response.data.imageUrl); // Set image URL from Cloudinary
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:bg-gray-100 file:border file:border-gray-300 file:rounded-md"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 bg-blue-500 text-white font-bold rounded-md ${loading ? "opacity-50" : ""}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" className="mt-2 max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default Upload;
