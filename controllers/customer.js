const STRINGS = require("../utils/texts");
const Customer = require("../models/customer");
const Model = require("../models/model");
const HashQuery = require("../models/hashQuery")
const fs = require("fs");
const path = require("path");

const { v4: uuidv4 } = require("uuid");
// **********************
//create Customer

exports.createCustomer = async (req, res) => {
  try {
    let body = req.body;
    //check if customer email exists
    let customerExist = await Customer.findOne({ email: body.email });
    if (customerExist) {
      return res.status(403).json({ message: STRINGS.ERRORS.CustomerExists });
    }
    //generating uuid , a random string
    let uniqueId = uuidv4();
    //
    body.uniqueId = uniqueId;
    //create new Customer
    let customer = await Customer.create(body);
    res.status(200).json({ message: STRINGS.TEXTS.CustomerCreated, customer });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
//update createCustomer

exports.updateCustomer = async (req, res) => {
  try {
    //params customer id
    let customerId = req.params.id;
    const { first_name, last_name, email } = req.body;
    // Check if Customer exist
    let customerExist = await Customer.findOne({ _id: customerId });
    if (!customerExist)
      return res.status(400).send({ message: STRINGS.ERRORS.CustomerNotFound });
    //update Customer
    let customer = await Customer.findOneAndUpdate(
      {
        _id: customerId,
      },
      {
        $set: {
          first_name: first_name,
          last_name: last_name,
          email: email,
        },
      },
      {
        new: true,
      }
    );
    res.json({ message: STRINGS.TEXTS.CustomerUpdated, customer });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};

//get customer
exports.getCustomer = async (req, res) => {
  try {
    //params customer id
    let customerId = req.params.id;
    // Check if Customer exist
    let customer = await Customer.findOne({ _id: customerId }).populate(
      "models"
    );
    if (!customer)
      return res.status(400).send({ message: STRINGS.ERRORS.CustomerNotFound });

    return res.json({ customer });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};

//get customer by uniqueId
exports.getCustomerByUniqueId = async (req, res) => {
  try {
    let uniqueId = req.params.id;
    let customer = await Customer.findOne({ uniqueId: uniqueId }).populate(
      "models"
    );
    if (!customer)
      return res.status(400).send({ message: STRINGS.ERRORS.CustomerNotFound });

    return res.json({ customer });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
//get all Customers

exports.getAllCustomers = async (req, res) => {
  try {
    //find all customers
    let customers = await Customer.find();
    return res.json({ customers });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
//get all model for customer

exports.getAllModelsByCustomer = async (req, res) => {
  try {
    let { uniqueId } = req.body;
    let customer = await Customer.findOne({ uniqueId: uniqueId }).populate("models");
    return res.json(customer.models);
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};

//delete single Customer

exports.deleteCustomer = async (req, res) => {  
  try {
    let customerId = req.params.id;
    let customer = await Customer.findOne({ _id: customerId });
    if (!customer)
      return res.status(400).send({ message: STRINGS.ERRORS.CustomerNotFound });

    const customerFolder = path.join(
      path.resolve("./"),
      `/uploads/${customer.uniqueId}`
    );

    fs.rmdirSync(
      customerFolder,
      { recursive: true },
      () => {
        console.log("Folder Deleted!");
      }
    );

    await Model.deleteMany({
      owner: customerId,
    });
    await Customer.findByIdAndRemove({ _id: customerId });
    return res.json({ message: STRINGS.TEXTS.CustomerDeleted });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
//get all Models for customer

exports.getAllCustomers = async (req, res) => {
  try {
    //find all customers
    let customers = await Customer.find().populate("models");
    return res.json({ customers });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
//upload models for specific customer

exports.uploadModels = async (req, res) => {
  try {
    const files = req.files;
    let modelUrls = [];
    files &&
      files.map((file) => {
        let url = process.env.BASE_URL + "/" + file.path;
        modelUrls.push(url);
      });
    let { id: uniqueId } = req.params;
    //check if customer email exists
    let customer = await Customer.findOne({ uniqueId: `${uniqueId}` });
    if (!customer) {
      return res.status(403).json({ message: STRINGS.ERRORS.CustomerNotFound });
    }
    // group models into pairs of related glb and usdz files
    // converts ['app.glb', 'app.usdz', 'game.glb']
    // into { app: [ 'app.glb', 'app.usdz' ], game: [ 'game.glb' ] }
    let modelGroups = modelUrls.reduce((prev, cur) => {
      (prev[path.parse(cur).name] = prev[path.parse(cur).name] || []).push(cur);
      return prev;
    }, {});
    
    console.log(modelGroups);
    for (group in modelGroups) {
      let urls = modelGroups[group].sort();
      let glb = urls.filter(v => v.includes('glb')).slice(-1).pop();
      let usdz = urls.filter(v => v.includes('usdz')).slice(-1).pop();
      let identifier = (Math.random() + 1).toString(36).substring(6);

      let model = await Model.create({
        url: glb || "",
        urlIOS: usdz || "",
        owner: customer._id
      });

      await Customer.findOneAndUpdate(
        {
          uniqueId: uniqueId,
        },
        {
          $push: {
            models: model._id,
          },
        },
        {
          new: true,
        }
      );
      await HashQuery.create({
        identifier: identifier,
        modelId: model._id,
        customerId: uniqueId
      })
    }

    res.status(200).send({ message: "File Uploaded Successfully" });
  } catch (error) {
    console.log("Error--->iii", error);

    res.status(500).json({ message: error.message });
  }
};
//delete single model

exports.deleteModel = async (req, res) => {
  try {
    //params customer id
    let { model } = req.body;
    // Check if Model exist
    let modelExist = await Model.findOne({
      _id: model._id,
    });

    if (!modelExist)
      return res.status(400).send({ message: STRINGS.ERRORS.ModelNotFound });

    // remove the files
    let dir = path.resolve("./");
    let glbFile = path.join(dir, model.url.replace(process.env.BASE_URL, ''));
    let usdzFile = path.join(dir, model.urlIOS.replace(process.env.BASE_URL, '')); 
    fs.unlink(glbFile, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File removed:", path);
      }
    })

    fs.unlink(usdzFile, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File removed:", path);
      }
    })

    // remove the model object
    await Model.deleteOne({ _id: model._id });

    return res.json({ message: STRINGS.TEXTS.ModelDeleted });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
