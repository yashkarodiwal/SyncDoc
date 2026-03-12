require("dotenv").config({ quiet: true});

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// DATABASE CONNECTION
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const aiRoutes = require("./routes/aiRoutes");

// CONNECT DATABASE
connectDB();

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("SyncDoc API running...");
});


// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let activeUsers = {};

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    let currentDocument = null;
    let currentUser = null;

    // JOIN DOCUMENT
    socket.on("join-document", ({ documentId, user }) => {

        socket.join(documentId);

        currentDocument = documentId;
        currentUser = user;

        if (!activeUsers[documentId]) {
            activeUsers[documentId] = [];
        }

        if (!activeUsers[documentId].includes(user)) {
            activeUsers[documentId].push(user);
        } else {
            return;
        }

        io.to(documentId).emit("active-users", activeUsers[documentId]);

        console.log(`${user} joined document ${documentId}`);

    });

    // REAL-TIME DOCUMENT EDIT
    socket.on("send-changes", ({ documentId, delta }) => {

        socket.to(documentId).emit("receive-changes", delta);

    });

    // CHAT
    socket.on("send-message", ({ documentId, message, fileUrl, user }) => {

        io.to(documentId).emit("receive-message", {
            message,
            fileUrl,
            sender: {
                name: user
            },
            timestamp: new Date()
        });

    });

    // CURSOR
    socket.on("cursor-move", ({ documentId, user, index }) => {

        socket.to(documentId).emit("cursor-update", {
            user,
            index
        });

    });

    // DISCONNECT
    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

        if (currentDocument && currentUser) {

            activeUsers[currentDocument] =
                activeUsers[currentDocument].filter(u => u !== currentUser);

            io.to(currentDocument).emit(
                "active-users",
                activeUsers[currentDocument]
            );
        }

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});