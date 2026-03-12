const express = require("express");
const router = express.Router();

const {
    summarizeDocument,
    fixGrammar,
    rewriteText
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/summarize", authMiddleware, summarizeDocument);

router.post("/grammar", authMiddleware, fixGrammar);

router.post("/rewrite", authMiddleware, rewriteText);

module.exports = router;