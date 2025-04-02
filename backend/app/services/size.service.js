const { ObjectId, ReturnDocument } = require("mongodb");

class SizeService{
    constructor() {
        this.Size = MongoDB.getClient().db().collection("size");
        this.ProductDetail = MongoDB.getClient().db().collection("productDetail");

    }

    extractSizeData(payload) {
        const size = {
            name: payload.name,
            note: payload.note,
            isActive:  payload.isActive !== undefined ? payload.isActive : true,
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
        return await this.find({
           name: { $regex: new RegExp(`.*${name}.*`, "i") }
        });
    }

        // findById
    async findById(id) {
        return await this.Size.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

        async findOne(query) {
        try {
            const size = await this.Size.findOne(query);
            if (!size) {
                throw new Error(`Không tìm thấy size với điều kiện: ${JSON.stringify(query)}`);
            }
            return size;
        } catch (err) {
            console.log("Lỗi khi findOne Size: ", err.message);
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
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

    async delete(id) {
        let result = null;
        const filter = { _id: new ObjectId(id) };
        const checkSize = await this.ProductDetail.find({ size_id: new ObjectId(id) }).toArray();
        if (checkSize.length > 0) {  // Nếu có sản phẩm thuộc category này
            result = await this.Size.findOneAndUpdate(
                filter,
                { $set: { isActive: false } },
                { returnDocument: "after" },
                
            );
            result.message = "Đã cập nhật trạng thái"
        }
        else {
            result = await this.Size.findOneAndDelete({
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            });
            result.message = "Đã xóa thành công"
        }
        return result;
    }

    async deleteAll() {
        const result = await this.Size.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = SizeService;