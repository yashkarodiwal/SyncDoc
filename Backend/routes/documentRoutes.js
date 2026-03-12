const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createDocument,
    getDocuments,
    getDocument,
    updateDocument,
    deleteDocument,
    shareDocument,
    updateTitle
} = require("../controllers/documentController");


router.post("/", authMiddleware, createDocument);

router.get("/", authMiddleware, getDocuments);

router.get("/:id", authMiddleware, getDocument);

router.put("/:id", authMiddleware, updateDocument);

router.delete("/:id", authMiddleware, deleteDocument);

router.post("/share", authMiddleware, shareDocument);

router.put("/:id/title", authMiddleware, updateTitle);

module.exports = router;