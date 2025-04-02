const http = require("http");
const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const PORT = config.app.port;
const { initSocket } = require("./socket");
const DiscountService = require("./app/services/discount.service");
const server = http.createServer(app);
const cron = require("node-cron");

async function startServer() {

    try {
        await MongoDB.connect(config.db.uri);
        console.log("Connected to the database!");
        const PORT = config.app.port;

        initSocket(server);
        
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }
        );

        const discountServiceInstance = new DiscountService();
        cron.schedule("*/1 * * * *", () => {
            discountServiceInstance.checkAndUpdateDiscounts();
        })
    }
    catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit(1);
    }
}

startServer();