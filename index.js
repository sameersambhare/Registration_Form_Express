const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
console.log(username);
const pass = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${pass}@cluster0.u675bel.mongodb.net/RegistrationDB`
);
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const registrationModel = mongoose.model("Registrations", registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/pages/index1.html")));
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/pages/index1.html");
});
app.post("/register", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await registrationModel.findOne({
      email: email,
    });
    if (!existingUser) {
      const registrationData = await new registrationModel({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exits.");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});
app.get("/success", function (req, res) {
  res.sendFile(__dirname + "/pages/success1.html");
});
app.get("/error", function (req, res) {
  res.sendFile(__dirname + "/pages/error1.html");
});
app.listen(port, () => {
  console.log(`Starting the server on PORT ${port}`);
});
