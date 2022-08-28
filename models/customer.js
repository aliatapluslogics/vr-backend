const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const customerSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, required: true },
    models: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
    }],
    uniqueId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(STRINGS.MODALS.CUSTOMER, customerSchema);
