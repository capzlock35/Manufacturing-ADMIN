import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    image: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    productName: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true, 
        maxlength: [20, 'Description must be less than or equal to 20 characters.'] 
    },
    postDate: { 
        type: Date, 
        default: Date.now 
    },
    price: { 
        type: Number, 
        required: true 
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
