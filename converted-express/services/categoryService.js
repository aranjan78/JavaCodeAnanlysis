```javascript
const categoryDao = require('./categoryDao');

async function addCategory(name) {
  return await categoryDao.addCategory(name);
}

async function getCategories() {
  return await categoryDao.getCategories();
}

async function deleteCategory(id) {
  return await categoryDao.deleteCategory(id);
}

async function updateCategory(id, name) {
  return await categoryDao.updateCategory(id, name);
}

async function getCategory(id) {
  return await categoryDao.getCategory(id);
}

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategory
};
```