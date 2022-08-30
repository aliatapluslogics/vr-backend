const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const hashQuerySchema = new Schema(
  {
    identifier: String,
    modelId: String,
    customerId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.HASHQUERY, hashQuerySchema);
