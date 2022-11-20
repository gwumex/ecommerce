const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
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
        if(req.body.password !== passwordConfirmation){
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