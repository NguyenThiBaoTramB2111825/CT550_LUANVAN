
const { ObjectId, ReturnDocument } = require("mongodb");
const ApiError = require("../api-error");

class ImportDetailService{
    constructor(client) {
        this.ProductDetail = client.db().collection("productDetail");
        this.Supplier = client.db().collection("supplier");
        this.ImportDetail = client.db().collection("importDetail");
    }
        parseDate(dateStr, isEndDate = false) {
        if (!dateStr) return null;
        console.log("Định dạng ngày ban đầu:", dateStr);

        // Chuyển dấu '/' thành '-'
        let parts = dateStr.replace(/\//g, '-').split('-');

        // Đảm bảo tháng và ngày có hai chữ số (2025-2-5 -> 2025-02-05)
        if (parts.length === 3) {
            let [year, month, day] = parts;
            month = month.padStart(2, '0'); // Thêm '0' nếu tháng chỉ có 1 chữ số
            day = day.padStart(2, '0');     // Thêm '0' nếu ngày chỉ có 1 chữ số
            dateStr = `${year}-${month}-${day}`;
        }

        // Chuyển sang định dạng chuẩn ISO
        const parsedDate = new Date(`${dateStr}${isEndDate ? 'T23:59:59.999Z' : 'T00:00:00.000Z'}`);

        console.log("Giá trị sau khi parse:", parsedDate);

        if (isNaN(parsedDate.getTime())) {
            console.error("Lỗi: Giá trị ngày không hợp lệ", dateStr);
            throw new Error("Ngày không hợp lệ: " + dateStr);
        }

        return parsedDate;
    }

    extractImportDetailData (payload) {
        const importDetail = {
            productDetail_id: ObjectId.isValid(payload.productDetail_id) ? new ObjectId(payload.productDetail_id) : undefined,
            supplier_id: ObjectId.isValid(payload.supplier_id) ? new ObjectId(payload.supplier_id) : undefined,
            importDate: this.parseDate(payload.importDate) || undefined,
            quantity: payload.quantity ? parseFloat(payload.quantity) : undefined,
            price_import: payload.price_import ? parseFloat(payload.price_import) : undefined,
            employee_id: ObjectId.isValid(payload.employee_id) ? new ObjectId(payload.employee_id) : undefined,
            employee_name: payload.employee_name || null,
            employee_id_update: ObjectId.isValid(payload.employee_id) ? new ObjectId(payload.employee_id) : undefined,
            employee_name_update: payload.employee_name || null,
         
        };

        Object.keys(importDetail).forEach(
            (key) => importDetail[key] === undefined && delete importDetail[key]
        );
        return importDetail;
    }

    async create(req, payload) {
        try {
            const importDetail = this.extractImportDetailData(payload);
            console.log("Giá trị sau khi extract: ", importDetail);
            const productDetailId = await this.ProductDetail.findOne({ _id: importDetail.productDetail_id });
            if (!productDetailId) {
                return { statusCode: 400, message: "ProductDetailId không tồn tại" };
            }
            console.log("Giá trị của productDetailId sau khi được tìm thấy: ", productDetailId);

            const supplierId = await this.Supplier.findOne({ _id: importDetail.supplier_id });
            if (!supplierId) {
                return { statusCode: 404, message: "SupplierId không tồn tại" };
            }
                
            console.log("Giá trị của supplierId sau khi được tìm thấy: ", supplierId);
            // Cùng 1 chi tiết sản phẩm và cùng 1 nhà cung cấp thì có thể có nhiều chi tiết nhật

            importDetail.employee_id = req.user.id;
            importDetail.employee_name = req.user.name;

            const result = await this.ImportDetail.insertOne(importDetail);
            console.log("Thêm thành công ========================== ");
            await this.ProductDetail.updateOne(
                { _id: importDetail.productDetail_id },
                { $inc: { stock: importDetail.quantity } }
            );

            return { statusCode: 200, _id: result.insertedId, ...importDetail };
        } catch (error) {
             throw new Error(`Lỗi truy vấn sản phẩm: ${error.message}`);
        }
    }

    //findByInfo
    async getImportDetailInfoById(_id) {
        return await this.ImportDetail.findOne({
            _id: ObjectId.isValid(_id) ? new ObjectId (_id): null,
        })
    }

    async find(filter) {
        const cursor = await this.ImportDetail.find(filter);
        return await cursor.toArray();

    }   
       
    async findByName(name) {
        return await this.findOne({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }


        // findById
    async findById(id) {
        return await this.ImportDetail.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async findOne(query) {
        try {
            const importDetail = await this.ImportDetail.findOne(query);
            if (!importDetail) {
                throw new Error(`Không tìm thấy sản phẩm với điều kiện: ${JSON.stringify(query)}`);
            }
            return importDetail;
        } catch (err) {
            throw new Error(`Lỗi truy vấn sản phẩm: ${err.message}`);
        }
    }

    async update(id, payload, req) {

        console.log("User info:", req.user); // Kiểm tra xem req.user có giá trị không

        if (!req.user) {
            return { statusCode: 401, message: "Unauthorized: Người dùng chưa được xác thực" };
        }
        console.log("id và pay load nhận được: ", id, payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const existingImportDetail = await this.ImportDetail.findOne(filter);
        if (!existingImportDetail) {
            return { statusCode: 404, message: "ImportDetail cần cập nhật không tồn tại" };
        }
            
        const update = this.extractImportDetailData(payload);
        console.log("Giá trị của update sau khi được extract: ", update);
        
        if (Object.keys(update).length === 0) {
            console.log("Object update rỗng");
            return { statusCode: 400, message: "Không có dữ liệu để cập nhật" };
        }
        // Bảo toàn các giá trị cũ cho các trường không có trong payload
        for (let key in existingImportDetail) {
            if (existingImportDetail.hasOwnProperty(key) && update[key] === undefined) {
                update[key] = existingImportDetail[key];
                console.log(`Giá trị sau khi được gán cho update.${key}:  ${update[key]}`);
            }
        }

        const productDetailId = await this.ProductDetail.findOne({ _id: update.productDetail_id });
        if (!productDetailId) {
            return { statusCode: 400, message: "ProductDetail cần cập nhật không tồn tại" };
        }

        const supplierId = await this.Supplier.findOne({ _id: update.supplier_id });
        if (!supplierId) {
            return { statusCode: 404, message: "Supplier cần cập nhật không tồn tại" };
        }

        const isSameData = Object.keys(update).every(key => update[key] === existingImportDetail[key]);
        if (isSameData) {
            return { statusCode: 400, message: "Không có dữ liệu mới nào cần được cập nhật" };
        }

        const diff = update.quantity - existingImportDetail.quantity;


        // Cập nhật số lượng tồn kho
        await this.ProductDetail.updateOne(
            { _id: existingImportDetail.productDetail_id },
            {
                $inc: { stock: diff },// Cộng/trừ theo chênh lệch
            } 
        );

        update.employee_id_update =  new ObjectId(req.user.id);
        console.log("Giá trị của update.employee_id_update", update.employee_id_update);
        update.employee_name_update = req.user.name;
        console.log("Giá trị của  update.employee_name_update",  update.employee_name_update);
        

        try {
            const result = await this.ImportDetail.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );

            console.log("result nhận được: ", result);
        
            if (!result) {
                return { statusCode: 400, message: "Không thể cập nhật ImportDetail" }
            }

            return { statusCode: 200, message: "Discount cập nhật thành công", data: update };
        }
        catch (error) {
            console.error("Lỗi khi cập nhật importDetail: ", error);
            return { statusCode: 500, message: "Lỗi server", error: error.message };
        }
    };

    async delete(id) {
        const result = await this.ImportDetail.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.ImportDetail.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = ImportDetailService;