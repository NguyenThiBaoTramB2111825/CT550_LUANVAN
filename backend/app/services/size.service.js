const { ObjectId, ReturnDocument } = require("mongodb");

class SizeService{
    constructor(client) {
        this.Size = client.db().collection("size");

    }

    extractSizeData(payload) {
        const size = {
            name: payload.name
        };
        Object.keys(size).forEach(
            (key) => size[key] === undefined && delete size[key]
        );
        return size;
    }

    async create(payload) {
        const size = this.extractSizeData(payload);
        const result = await this.Size.insertOne(size);
        if (result.acknowledged) {
            return { _id: result.insertedId, ...size };  // Trả về dữ liệu đúng
        }
        return null;
    }

    //findByInfo
    async getSizeInfoById(_id) {
        return await this.Size.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.Size.find(filter);
        return await cursor.toArray();

    }   

    // async findByName(name) {
    //     // Hàm thoát các ký tự đặc biệt trong chuỗi
    //     function escapeRegExp(string)   {
    //         return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    //     }
    //     const escapedName = escapeRegExp(name);

    //     // Tạo biểu thức chính quy với tùy chọn 'i' để không phân biệt chữ hoa chữ thường
    //     const regex = new RegExp(escapedName, 'i');
    //     return await this.findOne({ name: { $regex: regex } });
    // }

       async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }


        // findById
    async findById(id) {
        return await this.Size.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findOne(query) {
    return await this.Size.findOne(query);
}


    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const update = this.extractSizeData(payload);
        const result = await this.Size.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id){
        const result = await this.Size.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Size.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = SizeService;