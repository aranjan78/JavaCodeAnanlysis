```javascript
const mongoose = require('mongoose');
const User = mongoose.model('User', {
  // assuming the User model is defined elsewhere
  // if not, define it here
  username: String,
  password: String,
  // other fields...
});

const getAllUser = async () => {
  try {
    return await User.find().exec();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const saveUser = async (user) => {
  try {
    const savedUser = await User.findByIdAndUpdate(user._id, user, { upsert: true, new: true });
    console.log('User added', savedUser._id);
    return savedUser;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUser = async (username, password) => {
  try {
    const user = await User.findOne({ username }).exec();
    if (user && user.password === password) {
      return user;
    } else {
      return new User(); // or return null, depending on the desired behavior
    }
  } catch (error) {
    console.error(error);
    return new User(); // or return null, depending on the desired behavior
  }
};

const userExists = async (username) => {
  try {
    const user = await User.findOne({ username }).exec();
    return !!user;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username }).exec();
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  getAllUser,
  saveUser,
  getUser,
  userExists,
  getUserByUsername,
};
```