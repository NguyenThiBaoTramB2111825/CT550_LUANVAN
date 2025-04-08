
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const dbName = "db_fashion_shop";
const RAW_COLLECTION = "provinces_raw";
const TARGET_COLLECTION = "provinces";

async function migrateProvinces() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);

        const rawData = await db.collection(RAW_COLLECTION).findOne();
        if (!rawData) {
            console.log("Không tìm thấy dữ liệu gốc.");
            return;
        }

        // Chỉ lấy phần tử là object thực (loại bỏ _id)
        const provincesArray = Object.entries(rawData)
            .filter(([key, value]) => key !== '_id') // loại bỏ _id nếu có
            .map(([_, value]) => value);

        console.log("Tổng số phần tử đọc được:", provincesArray.length);

        if (!Array.isArray(provincesArray)) {
            console.error("provincesArray is not an array");
            return;
        }
        provincesArray.forEach((item, index) => {
            if (typeof item !== 'object' || item === null || Array.isArray(item) || item instanceof require('mongodb').ObjectId) {
                console.error(`Dữ liệu không hợp lệ tại index ${index}:`, item);
            }
        });

        const validData = provincesArray.filter(item =>
            typeof item === 'object' &&
            !Array.isArray(item) &&
            item !== null &&
            !(item instanceof require('mongodb').ObjectId)
        );

        if (validData.length === 0) {
            console.warn("Không có dữ liệu hợp lệ để insert.");
            return;
        }

        // Chèn vào collection đích
        const result = await db.collection(TARGET_COLLECTION).insertMany(validData);
        console.log(`Đã chèn ${result.insertedCount} tỉnh/thành vào collection "${TARGET_COLLECTION}"`);

    } catch (err) {
        console.error("Lỗi:", err);
    } finally {
        await client.close();
    }
}

migrateProvinces();
