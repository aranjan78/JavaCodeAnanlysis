```javascript
const express = require('express');
const router = express.Router();

const userService = require('../services/userService');
const categoryService = require('../services/categoryService');
const productService = require('../services/productService');

router.get('/index', (req, res) => {
    const username = req.user.username;
    res.render('index', { username });
});

router.get('/login', (req, res) => {
    const error = req.query.error;
    if (error === 'true') {
        res.render('adminlogin', { msg: 'Invalid username or password. Please try again.' });
    } else {
        res.render('adminlogin');
    }
});

router.get(['/', '/Dashboard'], (req, res) => {
    const admin = req.user.username;
    res.render('adminHome', { admin });
});

router.get('/categories', async (req, res) => {
    const categories = await categoryService.getCategories();
    res.render('categories', { categories });
});

router.post('/categories', async (req, res) => {
    const category_name = req.body.categoryname;
    await categoryService.addCategory(category_name);
    res.redirect('/admin/categories');
});

router.get('/categories/delete', async (req, res) => {
    const id = req.query.id;
    await categoryService.deleteCategory(id);
    res.redirect('/admin/categories');
});

router.get('/categories/update', async (req, res) => {
    const id = req.query.categoryid;
    const categoryname = req.query.categoryname;
    await categoryService.updateCategory(id, categoryname);
    res.redirect('/admin/categories');
});

router.get('/products', async (req, res) => {
    const products = await productService.getProducts();
    if (products.length === 0) {
        res.render('products', { msg: 'No products are available' });
    } else {
        res.render('products', { products });
    }
});

router.get('/products/add', async (req, res) => {
    const categories = await categoryService.getCategories();
    res.render('productsAdd', { categories });
});

router.post('/products/add', async (req, res) => {
    const name = req.body.name;
    const categoryId = req.body.categoryid;
    const price = req.body.price;
    const weight = req.body.weight;
    const quantity = req.body.quantity;
    const description = req.body.description;
    const productImage = req.body.productImage;

    const category = await categoryService.getCategory(categoryId);
    const product = {
        name,
        category,
        description,
        price,
        image: productImage,
        weight,
        quantity,
    };
    await productService.addProduct(product);
    res.redirect('/admin/products');
});

router.get('/products/update/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productService.getProduct(id);
    const categories = await categoryService.getCategories();
    res.render('productsUpdate', { product, categories });
});

router.post('/products/update/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const categoryId = req.body.categoryid;
    const price = req.body.price;
    const weight = req.body.weight;
    const quantity = req.body.quantity;
    const description = req.body.description;
    const productImage = req.body.productImage;

    // await productService.updateProduct(id, { name, categoryId, price, weight, quantity, description, productImage });
    res.redirect('/admin/products');
});

router.get('/products/delete', async (req, res) => {
    const id = req.query.id;
    await productService.deleteProduct(id);
    res.redirect('/admin/products');
});

router.post('/products', (req, res) => {
    res.redirect('/admin/categories');
});

router.get('/customers', async (req, res) => {
    const customers = await userService.getUsers();
    res.render('displayCustomers', { customers });
});

router.get('/profileDisplay', async (req, res) => {
    try {
        // Assuming a database connection is established elsewhere
        const username = req.user.username;
        // const user = await userService.getUserByUsername(username);
        // res.render('updateProfile', user);
    } catch (error) {
        console.error(error);
    }
});

router.post('/updateuser', async (req, res) => {
    try {
        const userid = req.body.userid;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const address = req.body.address;

        // await userService.updateUser(userid, { username, email, password, address });
        req.login({ username, password }, (err) => {
            if (err) {
                console.error(err);
            }
        });
        res.redirect('/admin/index');
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
```