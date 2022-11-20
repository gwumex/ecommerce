const layout = require('../../layout');
const { getError } = require('../../helpers')

module.exports = () => {
  return layout({
    content: `      
        <a href="/signup">Need an account? Sign Up</a>
        <a href="/admin/products/new">Add new products</a>
         `
  });
};
