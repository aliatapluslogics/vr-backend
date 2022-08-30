const STRINGS = require("../utils/texts");
const HashQuery = require("../models/hashQuery");
// **********************
//De-Hash

exports.deHash = async (req, res) => {
    try {
        const { id } = req.query;
        let ifExist = await HashQuery.findOne({ identifier: id });
        if (!ifExist)
            return res.status(400).send({ message: STRINGS.ERRORS.DataNotExist });
        return res.json({ message: STRINGS.TEXTS.HashCreated, ifExist });
    } catch (error) {
        console.log("Error------>", error);
        res.status(500).json({ message: error.message });
    }
};

//hash
exports.hash = async (req, res) => {
    try {
        const { data } = req.body
        let identifier = (Math.random() + 1).toString(36).substring(6);
        if (identifier && data.modelId && data.customerId)
            await HashQuery.create({
                identifier: identifier,
                modelId: data.modelId,
                customerId: data.customerId
            })
        return res.json({ message: STRINGS.TEXTS.HashCreated, identifier });
    } catch (error) {
        console.log("Error------>", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getHash = async (req, res) => {
    try {
        const { customerId, modelId } = req.body
        const data = await HashQuery.findOne({ customerId, modelId })
        return res.json({ message: STRINGS.TEXTS.HashCreated, identifier: data.identifier });
    } catch (err) {
        console.log("Error------>", err);
        res.status(500).json({ message: err.message });
    }
}

