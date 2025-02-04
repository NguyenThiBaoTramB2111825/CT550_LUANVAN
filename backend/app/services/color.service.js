const { ObjectId, ReturnDocument } = require("mongodb");

class ColorService{
    constructor(client) {
        this.Color = client.db().collection("color");

    }

    extractColorData(payload) {
        const color = {
            name: payload.name,
            hexCode: payload.hexCode,

        };
        Object.keys(color).forEach(
            (key) => color[key] === undefined && delete color[key]
        );
        return color;
    }

    async create(payload) {
        const color = this.extractColorData(payload);
        const result = await this.Color.insertOne(color);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...color };  // Trả về dữ liệu đúng
        }
        return null;
}

    //findByInfo
    async getColorInfoById(_id) {
        return await this.Color.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Color.find(filter);
        return await cursor.toArray();

    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

        // findById
    async findById(id) {
        return await this.Color.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractColorData(payload);
        const result = await this.Color.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id){
        const result = await this.Color.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Color.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ColorService;