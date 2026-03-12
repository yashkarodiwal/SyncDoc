const express = require("express");
const router = express.Router();

const {
    getChatHistory,
    saveMessage
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

router.get("/:documentId", authMiddleware, getChatHistory);

router.post(
    "/",
    authMiddleware,
    uploadMiddleware.single("file"),
    saveMessage
);

module.exports = router;