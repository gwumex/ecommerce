const layout = require('../../layout');

module.exports = ( {products}) => {
  const renderedProducts = products
  .map(product => {
    return `
    <div>${product.title}</div>
    `
  }).join(' ')
  return layout({
    content: `      
    <h1 class="title">Products</h1>
    ${renderedProducts}
    <a href="/admin/products/new">Add new Products</a>
    <a href="/signout">Signout</a>
    `
  });
};