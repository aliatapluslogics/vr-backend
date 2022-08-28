// Init
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

// Common Middleware
module.exports = (app) => {
  app.use(cors());
  app.use(logger("dev"));
  app.use(express.json({ limit: 52428800 }));
  app.use(
    express.urlencoded({
      limit: 52428800,
      extended: true,
    })
  );
  app.use("/uploads", express.static("uploads", { maxAge: "31536000" }));
};
