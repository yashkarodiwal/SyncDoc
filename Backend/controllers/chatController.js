const Chat = require("../models/Chat");
const cloudinary = require("../config/cloudinary");


// GET CHAT HISTORY
exports.getChatHistory = async (req, res) => {

    try {

        const { documentId } = req.params;

        const messages = await Chat.find({ document: documentId })
            .populate("sender", "name")
            .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};


// SAVE MESSAGE
exports.saveMessage = async (req, res) => {

    try {

        const { documentId, message } = req.body;

        let fileUrl = null;

        // FILE UPLOAD
        if (req.file) {

            const result = await cloudinary.uploader.upload(req.file.path);

            fileUrl = result.secure_url;

        }

        const chat = await Chat.create({
            document: documentId,
            sender: req.user.id,
            message,
            fileUrl
        });

        res.json(chat);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};