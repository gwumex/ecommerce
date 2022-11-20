const layout = require('../../layout');
const { getError } = require('../../helpers')

module.exports = ({ errors }) => {
  return layout({
    content: `
        <form method="POST">
            <input required placeholder="Title" name="title" />
            <input required placeholder="Price" name="price" /> 
            <input type="file" name="image" /> 
            <button>Submit</button>                  
        </form>            
        <a href="/signup">Need an account? Sign Up</a>
         `
  });
};
