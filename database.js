// Init
const mongoose = require("mongoose");
const db_url = process.env.MONGODB_URI;

// Setting
mongoose.set("debug", true);

// Connection
mongoose
  .connect(db_url)
  .then(() => console.log(`We are connected to ${db_url} database :)`))
  .catch((err) => {
    console.log("DB Connection Error :( -------> ", err);
  });
