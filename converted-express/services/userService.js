```javascript
const userDao = require('./userDao');

const getUsers = async () => {
  return await userDao.getAllUser();
};

const addUser = async (user) => {
  try {
    return await userDao.saveUser(user);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Add user error');
    }
    throw error;
  }
};

const checkLogin = async (username, password) => {
  return await userDao.getUser(username, password);
};

const checkUserExists = async (username) => {
  return await userDao.userExists(username);
};

const getUserByUsername = async (username) => {
  return await userDao.getUserByUsername(username);
};

module.exports = {
  getUsers,
  addUser,
  checkLogin,
  checkUserExists,
  getUserByUsername
};
```