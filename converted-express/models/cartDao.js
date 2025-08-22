```javascript
const mongoose = require('mongoose');
const Cart = mongoose.model('Cart', {
  // assuming the Cart model is defined elsewhere
});

const addCart = async (cart) => {
  const newCart = new Cart(cart);
  return await newCart.save();
};

const getCarts = async () => {
  return await Cart.find().exec();
};

const updateCart = async (cart) => {
  return await Cart.findByIdAndUpdate(cart._id, cart, { new: true });
};

const deleteCart = async (cart) => {
  return await Cart.findByIdAndRemove(cart._id);
};

module.exports = {
  addCart,
  getCarts,
  updateCart,
  deleteCart
};
```