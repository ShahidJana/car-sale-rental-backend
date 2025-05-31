const express = require("express");
const app = express();
require("dotenv").config();
require("./Models/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const path = require("path");

app.use(bodyParser.json());
app.use(cors());

app.use("/api/user_auth", require("./Routes/user_authRouter"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/cars", require("./Routes/carRoutes"));
app.use("/api/sales", require("./Routes/saleRoutes"));
app.use("/api/rentals", require("./Routes/rentalRoutes"));
app.use("/api/reviewratings", require("./Routes/reviewratingRoutes"));
app.use("/api/contact", require("./Routes/contactRoute"));

app.listen(PORT, () => {
  console.log("Server is Running at PORT ", PORT);
});
