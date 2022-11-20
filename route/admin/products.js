const express = require('express');
const productsRepo = require('../../repositories/productsRepositories');
const router = express.Router();
const productTemplate = require('../../views/products/productslayout')

router.get('/admin/products', async (req, res) => {
    res.send(productTemplate())
})
router.post('/admin/products', async (req, res) => {
    const{ email, password} = req.body
    console.log(email, password);
    await productsRepo.create({ email: email, password: password });
    res.send('completed')
})
router.get('/admin/products/new', (req, res) => {
    res.send('hello')
})

module.exports = router;