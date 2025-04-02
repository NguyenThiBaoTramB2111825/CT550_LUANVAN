// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3001",
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     },
// });

// io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);

//     socket.on("disconnect", () => {
//         console.log("Client disconnected:", socket.id);
//     });
// });

// module.exports = { io, server };

let ioInstance = null;

function initSocket(server) {
    ioInstance = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3001"
        }
    });

    ioInstance.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

function getSocket() {
    if (!ioInstance) {
        throw new Error("Socket.io chưa được khởi tạo!");
    }
    return ioInstance;
}

module.exports = { initSocket, getSocket };
