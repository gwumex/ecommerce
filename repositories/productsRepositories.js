const Repo = require('./repositories');
class ProductsRepositories extends Repo {
    async create(attrs) {
        //
        attrs.id = this.randomId();
        const records = await this.getAll();
        const record = attrs;
        records.push(record);
        await this.writeAll(records);
        return record;
    }
}

// const test = async () => {
//     const repo = new ProductsRepositories('products.json');
//     await repo.create({email: 'hell', password: 'hell'})

//     const users = await repo.getOneBy({email: 'he'});
//     console.log(users);
// }   
module.exports = new ProductsRepositories('products.json');