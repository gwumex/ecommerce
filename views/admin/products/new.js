const layout = require('../../layout');
const { getError } = require('../../helpers')

module.exports = ({ errors }) => {
  return layout({
    content: `
        <form method="POST">
            <input required placeholder="Title" name="title" />
            ${getError(errors, 'title')}
            <input required placeholder="Price" name="price" /> 
            ${getError(errors, 'price')}
            <input type="file" name="image" /> 
            <button>Submit</button>                  
        </form>            
        <a href="/signup">Need an account? Sign Up</a>
        <a href="/admin/products/">Products</a>

         `
  });
};

