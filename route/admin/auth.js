const usersRepo = require('../../repositories/users');
const express = require('express');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');

//validation
const { check, validationResult } = require('express-validator');

const router = express.Router();
router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup',
    [
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .custom( async (email) => {
                const existingUser = await usersRepo.getOneBy({ email })
                if (existingUser) {
                    throw new Error('email in use');
                }
            }),
        check('password')
            .trim()
            .isLength({min: 4, max: 20}),
        check('passwordConfirmation')
            .trim()
            .isLength({min: 4, max: 20})
            .custom((passwordConfirmation, { req }) => {
                if (req.body.password !== passwordConfirmation) {
                    throw new Error('Password must match')
                }
            }),
    ],
     async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        const { email, password, passwordConfirmation } = req.body;
        ///create a user in our user repo to represent
        const user = await usersRepo.create({ email: email, password: password });
        //store the id of that user inside the users cookies
        req.session.userId = user.id;
        res.send(`
    <h1>Signup complete</h1>
    welcome: ${req.session.userId}
    `)
    });


router.get('/signout', (req, res) => {
    req.session = null;
    res.send(`
        good bye
    `)
})
router.get('/signin', (req, res) => {
    res.send(signInTemplate())
})
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email });
    if (!user) {
        return res.send('email not found');
    }
    const compare = await usersRepo.comparePasswords(user.password, password);

    if (!compare) {
        return res.send('password incorrect')
    }
    res.send('login succesful')
})

module.exports = router;