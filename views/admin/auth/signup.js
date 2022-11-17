module.exports = ({req}) => {
    return `
    <div>
    welcome: ${req.session.userId}
        <p>hello</p>
        <form method="POST">
        <input type="text" name="email" placeholder ="email"/>
            <input type="text" name="password" placeholder = "password"/>
            <input type="text" name="passwordConfirmation" placeholder = "password comfirmation"/>
            <button type = "Submit">Sign Up</button>
        </form>
    </div>
    `
}