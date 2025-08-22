```javascript
const productDao = require('./productDao');

const getProducts = async () => {
  return await productDao.getProducts();
};

const addProduct = async (product) => {
  return await productDao.addProduct(product);
};

const getProduct = async (id) => {
  return await productDao.getProduct(id);
};

const updateProduct = async (id, product) => {
  product.id = id;
  return await productDao.updateProduct(product);
};

const deleteProduct = async (id) => {
  return await productDao.deleteProduct(id);
};

module.exports = {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct
};
```