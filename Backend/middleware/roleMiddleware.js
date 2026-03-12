const Permission = require("../models/Permission");

const roleMiddleware = (allowedRoles) => {

    return async (req, res, next) => {

        try {

            const documentId = req.params.id || req.body.documentId;

            const permission = await Permission.findOne({
                document: documentId,
                user: req.user._id
            });

            if (!permission) {
                return res.status(403).json({ message: "Access denied" });
            }

            if (!allowedRoles.includes(permission.role)) {
                return res.status(403).json({ message: "Insufficient permissions" });
            }

            next();

        } catch (error) {

            res.status(500).json({ message: error.message });

        }

    };

};

module.exports = roleMiddleware;