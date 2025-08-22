```javascript
const mongoose = require('mongoose');
const Category = mongoose.model('Category', {
  name: String
});

const addCategory = async (name) => {
  const category = new Category({ name });
  await category.save();
  return category;
};

const getCategories = async () => {
  return await Category.find().exec();
};

const deleteCategory = async (id) => {
  try {
    await Category.findByIdAndRemove(id).exec();
    return true;
  } catch (error) {
    return false;
  }
};

const updateCategory = async (id, name) => {
  const category = await Category.findByIdAndUpdate(id, { name }, { new: true }).exec();
  return category;
};

const getCategory = async (id) => {
  return await Category.findById(id).exec();
};

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  getCategory
};
```