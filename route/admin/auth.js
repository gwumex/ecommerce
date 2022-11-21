const usersRepo = require('../../repositories/users');
const express = require('express');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');
const { handleErrors, requireSignOut } = require('./middleware');

//validation

const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExist, requireValidPasswordForUser } = require('./validator')

const router = express.Router();
router.get('/signup', requireSignOut, (req, res) => {

    res.send(signUpTemplate({ req }));
});

router.post('/signup', requireSignOut,
    [
        requireEmail,
        requirePassword,
        requirePasswordConfirmation
    ],
    handleErrors(signUpTemplate),
    async (req, res) => {

        const { email, password } = req.body;
        ///create a user in our user repo to represent
        const user = await usersRepo.create({ email: email, password: password });
        //store the id of that user inside the users cookies
        req.session.userId = user.id;
        res.redirect('/admin/products')
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signin')

})
router.get('/signin', requireSignOut, (req, res) => {
    res.send(signInTemplate({}))
})

//----------------------sign in router-------------------------------
router.post('/signin', requireSignOut, [
    requireEmailExist,
    requireValidPasswordForUser
],
    handleErrors(signInTemplate),
    async (req, res) => {
        if (req.session.userId) {
            return res.redirect('/admin/products')
        }
        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });
        req.session.userId = user.id;
        res.redirect('/admin/products')
    })

module.exports = router;