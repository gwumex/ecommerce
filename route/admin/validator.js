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
    .isLength({min: 4, max: 20}),
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min: 4, max: 20})
    .custom((passwordConfirmation, { req }) => {
        if (req.body.password !== passwordConfirmation) {
            throw new Error('Password must match')
        }
    })
}