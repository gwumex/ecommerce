const usersRepo = require('../../repositories/users');
const express = require('express'); 
const signUpTemplate = require('../../views/admin/auth/signup')
const signInTemplate = require('../../views/admin/auth/signin')

const router = express.Router();
router.get('/signup',  (req, res) => {
    res.send(signUpTemplate({req}));
});

router.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;
    const existingUser = await usersRepo.getOneBy({email})
    if(existingUser){
        return res.send("user already exist")
    }
    if(password !== passwordConfirmation){
        return res.send("password must match")
    }
    ///create a user in our user repo to represent
    const user = await usersRepo.create({ email: email, password: password});

    req.session.userId = user.id;
    res.send(`
    <h1>Sign in complete</h1>
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
router.post('/signin', async (req, res) =>{
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email});
    if (!user) {
        return res.send('email not found');
    }
    const compare =  await usersRepo.comparePasswords(user.password, password);

    if(!compare){
        return res.send('password incorrect')
    }
    res.send('login succesful')
})

module.exports = router;