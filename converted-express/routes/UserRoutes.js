```javascript
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const productService = require('../services/productService');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/buy', (req, res) => {
    res.render('buy');
});

router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('userLogin', { msg: error === 'true' ? 'Please enter correct email and password' : null });
});

router.get('/', (req, res) => {
    const username = req.user.username;
    const products = productService.getProducts();
    res.render('index', { username, products: products.length > 0 ? products : null, msg: products.length === 0 ? 'No products are available' : null });
});

router.get('/user/products', (req, res) => {
    const products = productService.getProducts();
    res.render('uproduct', { products: products.length > 0 ? products : null, msg: products.length === 0 ? 'No products are available' : null });
});

router.post('/newuserregister', (req, res) => {
    const user = req.body;
    const exists = userService.checkUserExists(user.username);
    if (!exists) {
        user.role = 'ROLE_NORMAL';
        userService.addUser(user);
        res.render('userLogin');
    } else {
        res.render('register', { msg: `${user.username} is taken. Please choose a different username.` });
    }
});

router.get('/profileDisplay', (req, res) => {
    const username = req.user.username;
    const user = userService.getUserByUsername(username);
    if (user) {
        res.render('updateProfile', { userid: user.id, username: user.username, email: user.email, password: user.password, address: user.address });
    } else {
        res.render('updateProfile', { msg: 'User not found' });
    }
});

router.get('/test', (req, res) => {
    const friends = ['xyz', 'abc'];
    res.render('test', { author: 'jay gajera', id: 40, f: friends });
});

router.get('/test2', (req, res) => {
    const marks = [10, 25];
    res.render('test2', { name: 'jay gajera17', id: 40, marks });
});
```