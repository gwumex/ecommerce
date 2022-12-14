const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireTitle: check('title')
    .trim()
    .isLength({min: 5, max: 40})
    .withMessage('must be between 5 and 40 characters'),
    requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({min: 1}),
    requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom( async (email) => {
        const existingUser = await usersRepo.getOneBy({ email })
        if (existingUser) {
            throw new Error('email in use');
        }
    }),
    requirePassword: check('password')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min: 4, max: 20})
    .withMessage('must be between 4 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
        console.log(passwordConfirmation, req.body.password);
        if(passwordConfirmation !== req.body.password ){
                throw new Error ('password not match')
        }
    }),
    requireEmailExist: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid Email')
    .custom( async (email) => {
        const user = await usersRepo.getOneBy({ email });
        if (!user) {
            throw new Error ('email not found 11');
        }
    }),
    requireValidPasswordForUser: check('password')
    .trim()
    .custom( async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email });
        if (!user) {
            throw new Error('invalid password')
        }       
        const validPassword = await usersRepo.comparePasswords(user.password, password);        
        if ( !validPassword ) {
            throw new Error("invalid password")
        }
    })

}