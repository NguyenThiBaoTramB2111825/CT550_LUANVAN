const { ObjectId, ReturnDocument } = require("mongodb");
const cron = require("node-cron");
const ProductService = require("./product.service");
const MongoDB = require("../utils/mongodb.util");

// ở phần remaining được tính bằng cách khi sản phẩm có chứa thông tin khuyến mãi và
// được bán ra thì khi đó số lượng còn lại mới được trừ.

// Còn việc trừ ngay khi lưu thông tin khuyến mãi thì có thể discount
//  sẽ bị hết số lượng trong khi không có sản phẩm nào được mua

// Phần remaining có liên quan đến 

class discountService {
    constructor(client) {
        this.Discount = client.db().collection("discount");
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

    extractdiscountData(payload) {
        const now = new Date();
        const discount = {
            name: payload.name,
            description: payload.description,
            quantity: parseInt(payload.quantity, 10),
            remaining_quantity: payload.quantity,
            value: parseFloat(payload.value) || 0,
            // value: this.parseFloat(payload.value),
            type: payload.type || 'percentage' ,//|| "fixed",
            startDate: this.parseDate(payload.startDate),
            endDate:  this.parseDate(payload.endDate, true),
            isActive: this.parseDate(payload.startDate) <= now && now <= this.parseDate(payload.endDate, true),
        };

        if (discount.startDate > discount.endDate) {
            return {
                statusCode: 400, message: "Thời gian khuyến mãi không hợp lệ"
            }
        }

        console.log("Dữ liệu sau khi được extract: ", discount);
        // Remove undefined fields
        Object.keys(discount).forEach(
         (key) => (discount[key] === undefined || discount[key] === null) && delete discount[key]
        );

        return discount;
    }

    // create
    async create(payload) {
        console.log("Giá trị nhận vào từ payload: ", payload);
        const discount = this.extractdiscountData(payload);
        if (discount.statusCode === 400) {
            return {statusCode: 400, message: "Thời gian khuyến mãi không hợp lệ"}
        }
        console.log("Giá trị của discount sau khi extract: ", discount);
        let existingdiscount = await this.Discount.findOne({ name: discount.name });
        if (existingdiscount) {
            return {
                statusCode: 400, message: "discount đã tồn tại do tên chương trình đã được sử dụng"
            }
        }
        const result = await this.Discount.insertOne(discount);
        if (result.acknowledged) {
            return {
                _id: result.insertedId, ...discount
            };
        }
        return null;
    }

    async findOne(query) {
        try {
            const discount = await this.Discount.findOne(query);
            return discount;
        } catch (err) {
            console.error("Error finding discount: ", err);
            throw new Error("An error occured while retrieving discount");
        }
    }
    // find
    async find(filter) {
        const cursor = await this.Discount.find(filter);
        return await cursor.toArray();
    }

    // findByName
    async findByName(name) {
        return await this.find({
            name: {
                $regex: new RegExp(`.*${name}.*`, "i")
            }
        })
    }

    // findById
    async findById(id) {
        return await this.Discount.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        console.log("id và pay load nhận được: ", id, payload);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
        };

        // Kiểm tra discount có tồn tại không
        const existingdiscount = await this.Discount.findOne(filter);
        if (!existingdiscount) {
            return { statusCode: 404, message: "Chương trình giảm giá không tồn tại" };
        }

        const update = this.extractdiscountData(payload);

        const isSameData = Object.keys(update).every(key => {
            if (existingdiscount[key] instanceof Date) {
                return new Date(update[key]).getTime() === existingdiscount[key].getTime();
            }
            return update[key] === existingdiscount[key];
        });
        if (isSameData &&  payload.isActive == existingdiscount.isActive) {
            return {
                statusCode: 400, message: "Không có dữ liệu mới nào cần cập nhật"
            }
        }

        const duplicateCheck = update.name ? await this.Discount.findOne({
            _id: { $ne: new ObjectId(id) },
            name: update.name
        }) : null

        if (duplicateCheck) {
            return { statusCode: 409, message: "Tên chương trình khuyến mãi đã được sử dụng." };
        }
        
        update.startDate = payload.startDate ? this.parseDate(payload.startDate) : existingdiscount.startDate;
        update.endDate = payload.endDate ? this.parseDate(payload.endDate, true) : existingdiscount.endDate;
        
        // Nếu có isActive được truyền từ payload, thì sẽ lấy giá trị theo payload nhập vào
        if (typeof payload.isActive !== "undefined" && payload.isActive =="false") {
            update.isActive = payload.isActive;
        }
        else {
            update.isActive = update.startDate && update.endDate ?  update.startDate <= new Date() && new Date() <= update.endDate : false; // Kiểm tra tự động
        }
   
        console.log("Giá trị của isActive sau khi được so sánh: ", update.isActive);

        update.remaining_quantity = update.isActive ? (update.quantity ?? existingdiscount.quantity) : 0;

    
        try {
            const result = await this.Discount.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );

            console.log("result nhận được: ", result);
        
            if (!result) {
                return { statusCode: 400, message: "Không thể cập nhật discount" }
            }
            console.log("giá trị của id và isActive trước khi vào cập nhật trong product: ", id, update.isActive);
            console.log("Kiểu dữ liệu của discountId: ", typeof id);
        
            const productService = new ProductService(MongoDB.client);
            await productService.updateDiscountStatus(id, update.isActive);

            return { statusCode: 200, message: "Discount cập nhật thành công", data: result };
        }
        catch (error) {
            console.error("Lỗi khi cập nhật discount: ", error);
            return { statusCoce: 500, message: "Lỗi server", error: error.message };
        }

    }


    // delete
    async delete(id) {
        const result = await this.Discount.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // deleteAll
    async deleteAll() {
        const result = await this.Discount.deleteMany({});
        return result.deletedCount;
    }

    async findOnediscountByName (name) {
        try {
            const discount = await this.Discount.findOne({ name: name });
            return discount; 
        } catch (error) {
            console.error('Error finding discount by name:', error);
            throw error;
        }
    };
    
}
// cron job chạy tự động mỗi 10p
cron.schedule("*/10 * * * *", async () => {
    console.log("Chạy cron job kiểm tra trạng thái khuyến mãi...");

    const discounts = await this.Discount.find({}).toArray();
    const now = new Date();
    const productService = new ProductService(MongoDB.client);
    

    for (let discount of discounts) {
        const newIsActive = discount.startDate <= now && now <= discount.endDate;
        if (newIsActive !== discount.isActive) {
            console.log(`Cập nhật trạng thái của discount ${discount._id}: ${discount.isActive} -> ${newIsActive}`);

            await this.Discount.updateOne(
                { _id: discount._id },
                { $set: { isActive: newIsActive } }
            );

            await productService.updateDiscountStatus(discount._id, newIsActive);
        }
    }
});


module.exports = discountService;
