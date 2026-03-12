const Document = require("../models/Document");
const Permission = require("../models/Permission");
const User = require("../models/User");

// CREATE DOCUMENT
exports.createDocument = async (req, res) => {
    try {

        const document = await Document.create({
            title: "Untitled Document",
            content: "",
            owner: req.user.id
        });

        await Permission.create({
            document: document._id,
            user: req.user.id,
            role: "owner"
        });

        res.status(201).json(document);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET USER DOCUMENTS
exports.getDocuments = async (req, res) => {
    try {

        const permissions = await Permission.find({
            user: req.user.id
        }).populate("document");

        const docs = permissions.map(p => p.document);

        res.json(docs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// GET SINGLE DOCUMENT
exports.getDocument = async (req, res) => {
    try {

        const { id } = req.params;

        const permission = await Permission.findOne({
            document: id,
            user: req.user.id
        });

        if (!permission) {
            return res.status(403).json({ message: "Access denied" });
        }

        const doc = await Document.findById(id);

        res.json(doc);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE DOCUMENT CONTENT
exports.updateDocument = async (req, res) => {
    try {

        const { id } = req.params;
        const { content } = req.body;

        const permission = await Permission.findOne({
            document: id,
            user: req.user.id
        });

        if (!permission || permission.role === "viewer") {
            return res.status(403).json({ message: "No edit permission" });
        }

        const updatedDoc = await Document.findByIdAndUpdate(
            id,
            { content },
            { returnDocument: "after" }
        );

        res.json(updatedDoc);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE DOCUMENT TITLE
exports.updateTitle = async (req, res) => {

    try {

        const { id } = req.params;
        const { title } = req.body;

        const permission = await Permission.findOne({
            document: id,
            user: req.user.id
        });

        if (!permission || permission.role === "viewer") {
            return res.status(403).json({ message: "No edit permission" });
        }

        const doc = await Document.findByIdAndUpdate(
            id,
            { title },
            { returnDocument: "after" }
        );

        res.json(doc);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};


// DELETE DOCUMENT
exports.deleteDocument = async (req, res) => {
    try {

        const { id } = req.params;

        const permission = await Permission.findOne({
            document: id,
            user: req.user.id
        });

        if (!permission || permission.role !== "owner") {
            return res.status(403).json({ message: "Only owner can delete" });
        }

        await Document.findByIdAndDelete(id);
        await Permission.deleteMany({ document: id });

        res.json({ message: "Document deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// SHARE DOCUMENT
exports.shareDocument = async (req, res) => {
    try {

        const { documentId, email, role } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const permission = await Permission.create({
            document: documentId,
            user: user._id,
            role
        });

        res.json(permission);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};