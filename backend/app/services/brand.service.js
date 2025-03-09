const { ObjectId, ReturnDocument } = require("mongodb");

class BrandService{
    constructor(client) {
        this.Brand = client.db().collection("brand");

    }

    extractBrandData(payload) {
        const brand = {
            name: payload.name,
            description: payload.description,
            website: payload.website,

        };
        Object.keys(brand).forEach(
            (key) => brand[key] === undefined && delete brand[key]
        );
        return brand;
    }


    async create(payload) {
        const brand = this.extractBrandData(payload);
        const result = await this.Brand.insertOne(brand);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...brand };  // Trả về dữ liệu đúng
        }
        return null;
    }

    //findByInfo
    async getBrandInfoById(_id) {
        return await this.Brand.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Brand.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

        // findById
    async findById(id) {
        return await this.Brand.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractBrandData(payload);
        const result = await this.Brand.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id){
        const result = await this.Brand.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Brand.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = BrandService;