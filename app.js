// Init
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require("express");
//app
const app = express();
const port = process.env.PORT || 5005;
require("./database");

// Middleware
require("./middleware/common")(app);
app.use(express.static("build"));
// Routes
app.use("/api", require("./routes"));

// Server
app.listen(port || 5000, () => {
  console.log(`Server is running at port ${port} :)`);
});
