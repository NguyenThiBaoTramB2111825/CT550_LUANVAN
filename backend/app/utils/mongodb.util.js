const { MongoClient } = require("mongodb");

class MongoDB {
    static client = null;

    static async connect (uri) {
        if (!MongoDB.client) {
            MongoDB.client = new MongoClient(uri);
            await MongoDB.client.connect();
            console.log("Đã kết nối MongoDB")
        }
        
        return MongoDB.client;
    };

    static getClient() {
        if (!MongoDB.client) {
            throw new Error ("MongoDB chưa được kết nối, Hãy gọi MongoDB.connect(uri) trước")
        }
        return MongoDB.client;
    }
}

module.exports = MongoDB;