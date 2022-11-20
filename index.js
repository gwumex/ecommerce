const express = require('express');
const { next } = require('process');
let bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouther = require('./route/admin/auth');
const app = express();

app.use(express.static('public'));
let urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);
app.use(cookieSession({
    keys: ['udhdjdjdjdjuiooprtcaieuu89867464je7474y4747446jhsh7474896789e67474902647487494']
}))
app.use(authRouther);
app.listen(3000, () => {
    console.log("you are listening on port 3000");
})

    // const bodyParser = (req, res, next) => {
    //     if (req.method === "POST") {
    //         req.on('data', data => {
    //             const parsed = data.toString('utf8').split('&');
    //             const formData = {};
    //             for (let pair of parsed) {
    //                 const [key, value] = pair.split('=');
    //                 formData[key] = value;
    //             }
    //             req.body = formData;
    //             next();
    //         })
    //     } else {
    //         next();
    //     }
    // }