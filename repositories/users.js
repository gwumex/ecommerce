const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }
    //get all users
    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
    }
    //create a user
    async create(attrs) {
        //
    
        attrs.id = this.randomId();
        //salt
        const salt = crypto.randomBytes(8).toString('hex');

        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {...attrs, password: `${buf.toString('hex')}.${salt}`};
        records.push(record);
        await this.writeAll(records);
        return record;
    }
    //compare password
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.');
        const hashedSupplied = await scrypt(supplied, salt, 64);

        return hashed === hashedSupplied.toString('hex');
    }
    //save passwords to data base
    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
    //generate a random number
    randomId() {
        return crypto.randomBytes(4).toString('hex')
    }
    //get one id
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => (record.id) === id)
    }
    //delete
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => (record.id) !== id);
        await this.writeAll(filteredRecords)
    }
    //update
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => (record.id) === id);
        if (!record) {
            throw new Error(`Record with id ${id} not found`)
        }
        //copies all attrs to the record 
        Object.assign(record, attrs);
        await this.writeAll(records)
    }
    async getOneBy (filters){
        const records = await this.getAll();
        for (let record of records){
            let found = true;
            for (let key in filters){
                if(record[key] !== filters[key]) {
                    found = false;
                }
            }
            if(found) {
                return record;
            }
        }
    }
}
module.exports = new UsersRepository('users.json');