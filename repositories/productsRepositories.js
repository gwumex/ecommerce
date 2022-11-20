const Repo = require('./repository');
class ProductsRepositories extends Repo {
    async create(attrs) {
        //
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }
}

// const test = async () => {
//     const repo = new ProductsRepositories('products.json');
//     await repo.create({email: 'hell', password: 'hell'})

//     const users = await repo.getOneBy({email: 'he'});
//     console.log(users);
// }   
module.exports = new ProductsRepositories('products.json');