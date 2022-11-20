const express = require('express');
const productsRepo = require('../../repositories/productsRepositories');
const productNewTemplate = require('../../views/admin/products/new')
const productTemplate = require('../../views/admin/products/products')
const { requireTitle, requirePrice  } = require('./validator')
const { check, validationResult } = require('express-validator');


const router = express.Router();

router.get('/admin/products/new', async (req, res) => {
    res.send(productNewTemplate({}))
})
router.post('/admin/products/new', [ requireTitle, requirePrice], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.send(productNewTemplate({ errors }));
    }
    const{ email, password} = req.body
    console.log(email, password);
    await productsRepo.create({ email: email, password: password });
    res.send('completed')
})
router.get('/admin/products', (req, res) => {
    res.send(productTemplate())
})
module.exports = router;