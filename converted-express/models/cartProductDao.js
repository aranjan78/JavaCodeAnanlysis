```javascript
const mongoose = require('mongoose');
const CartProduct = mongoose.model('CartProduct', {
  // assuming CartProduct schema is defined elsewhere
});
const Product = mongoose.model('Product', {
  // assuming Product schema is defined elsewhere
});

const addCartProduct = async (cartProduct) => {
  const newCartProduct = new CartProduct(cartProduct);
  return await newCartProduct.save();
};

const getCartProducts = async () => {
  return await CartProduct.find().exec();
};

const getProductByCartID = async (cart_id) => {
  const cartProducts = await CartProduct.find({ cart_id }).exec();
  const productIds = cartProducts.map((cp) => cp.product_id);
  return await Product.find({ _id: { $in: productIds } }).exec();
};

const updateCartProduct = async (cartProduct) => {
  return await CartProduct.findByIdAndUpdate(cartProduct._id, cartProduct, { new: true }).exec();
};

const deleteCartProduct = async (cartProduct) => {
  return await CartProduct.findByIdAndRemove(cartProduct._id).exec();
};

module.exports = {
  addCartProduct,
  getCartProducts,
  getProductByCartID,
  updateCartProduct,
  deleteCartProduct,
};
```