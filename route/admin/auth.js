const usersRepo = require('../../repositories/users');
const express = require('express');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');

//validation
const { check, validationResult } = require('express-validator');

const { requireEmail, requirePassword, requirePasswordConfirmation } = require('./validator')

const router = express.Router();
router.get('/signup', (req, res) => {
    res.send(signUpTemplate({ req }));
});

router.post('/signup',
    [
       requireEmail,
       requirePassword,
       requirePasswordConfirmation
    ],
     async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            return res.send(signUpTemplate({ req, errors }));
        }
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

//sign in router
router.post('/signin', [
    check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom( async (email) => {
        const user = await usersRepo.getOne({ email });
        if (!user) {
            throw new Error ('email not found 11');
        }
    }),
    check('password')
    .trim()
],
    async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    const { email, password } = req.body;

    // const user = await usersRepo.getOneBy({ email });
    // if (!user) {
    //     return res.send('email not found');
    // }
    const compare = await usersRepo.comparePasswords(user.password, password);

    if (!compare) {
        return res.send('password incorrect')
    }
    res.send('login succesful')
})

module.exports = router;