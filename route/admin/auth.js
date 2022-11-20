const usersRepo = require('../../repositories/users');
const express = require('express');
const signUpTemplate = require('../../views/admin/auth/signup');
const signInTemplate = require('../../views/admin/auth/signin');

//validation
const { check, validationResult } = require('express-validator');

const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExist, requireValidPasswordForUser } = require('./validator')

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
    res.send(signInTemplate({ }))
})

//----------------------sign in router-------------------------------
router.post('/signin', [
    requireEmailExist,
    requireValidPasswordForUser
],
    async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.send(signInTemplate( {errors} ));
    }
    
    const { email } = req.body;
    
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.send('login succesful')
})

module.exports = router;