const express = require('express');
const productsRepo = require('../../repositories/productsRepositories');
const productNewTemplate = require('../../views/admin/products/new')
const productTemplate = require('../../views/admin/products/products')

const router = express.Router();

router.get('/admin/products/new', async (req, res) => {
    res.send(productNewTemplate({}))
})
router.post('/admin/products/new', async (req, res) => {
    const{ email, password} = req.body
    console.log(email, password);
    await productsRepo.create({ email: email, password: password });
    res.send('completed')
})
router.get('/admin/products', (req, res) => {
    res.send(productTemplate({}))
})

module.exports = router;