```javascript
const cartDao = require('./cartDao');

async function addCart(cart) {
  return await cartDao.addCart(cart);
}

async function getCarts() {
  return await cartDao.getCarts();
}

async function updateCart(cart) {
  await cartDao.updateCart(cart);
}

async function deleteCart(cart) {
  await cartDao.deleteCart(cart);
}

module.exports = {
  addCart,
  getCarts,
  updateCart,
  deleteCart
};
```