```javascript
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

const productDao = {
  getProducts: async () => {
    return await Product.find().exec();
  },

  addProduct: async (product) => {
    const newProduct = new Product(product);
    return await newProduct.save();
  },

  getProduct: async (id) => {
    return await Product.findById(id).exec();
  },

  updateProduct: async (product) => {
    return await Product.findByIdAndUpdate(product._id, product, { new: true });
  },

  deleteProduct: async (id) => {
    try {
      await Product.findByIdAndRemove(id);
      return true;
    } catch (error) {
      return false;
    }
  },
};

module.exports = productDao;
```