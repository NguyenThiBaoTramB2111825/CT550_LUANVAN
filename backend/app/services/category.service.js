const { ObjectId, ReturnDocument } = require("mongodb");

class CategoryService{
    constructor(client) {
        this.Category = client.db().collection("category");

    }

    extractCategoryData(payload) {
        const category = {
            name: payload.name,
            description: payload.description,

        };
        Object.keys(category).forEach(
            (key) => category[key] === undefined && delete category[key]
        );
        return category;
    }
    // create
    // async create(payload) {
    //     const category = this.extractCategoryData(payload);
    //     const result = await this.Category.insertOne(category);
    //     return result.value;
    // }

    async create(payload) {
        const category = this.extractCategoryData(payload);
        const result = await this.Category.insertOne(category);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...category };  // Trả về dữ liệu đúng
        }
        return null;
}

    //findByInfo
    async getCategoryInfoById(_id) {
        return await this.Category.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Category.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

        // findById
    async findById(id) {
        return await this.Category.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractCategoryData(payload);
        const result = await this.Category.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id){
        const result = await this.Category.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Category.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = CategoryService;