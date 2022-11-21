const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const { handleErrors, requireAuth } = require('./middleware');
const productsRepo = require('../../repositories/productsRepositories');
const productNewTemplate = require('../../views/admin/products/new')
const productTemplate = require('../../views/admin/products/index')
const { requireTitle, requirePrice } = require('./validator')



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', 
    requireAuth, 
    async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productTemplate({products}))
})

router.get('/admin/products/new', 
    requireAuth,
    async (req, res) => {

    res.send(productNewTemplate({}))
})

router.post('/admin/products/new',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productNewTemplate),
    async (req, res) => {
        if (!req.session.userId){
            return res.redirect('/signin')
        }
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });
        res.redirect('/admin/products');
    })
module.exports = router;