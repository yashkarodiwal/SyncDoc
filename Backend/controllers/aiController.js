const model = require("../config/gemini");

// SUMMARIZE
exports.summarizeDocument = async (req, res) => {

    try {

        const { content } = req.body;

        const prompt = `Summarize this document:\n\n${content}`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({ result: response });

    } catch (error) {

        console.error("Summarize error:", error);
        res.status(500).json({ message: "AI summarize failed" });

    }

};


// FIX GRAMMAR
exports.fixGrammar = async (req, res) => {

    try {

        const { content } = req.body;

        const prompt = `Fix grammar mistakes:\n\n${content}`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({ result: response });

    } catch (error) {

        console.error("Grammar error:", error);
        res.status(500).json({ message: "AI grammar failed" });

    }

};


// REWRITE
exports.rewriteText = async (req, res) => {

    try {

        const { content } = req.body;

        const prompt = `Rewrite this clearly:\n\n${content}`;

        const result = await model.generateContent(prompt);

        const response = result.response.text();

        res.json({ result: response });

    } catch (error) {

        console.error("Rewrite error:", error);
        res.status(500).json({ message: "AI rewrite failed" });

    }

};