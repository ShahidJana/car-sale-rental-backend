const mongoose = require("mongoose");
const mongo_URL = process.env.MONGO_CONN;

mongoose
  .connect(mongo_URL)
  .then(() => {
    console.log("MongooDB connected Successfully");
  })
  .catch(()=>{
    console.log(err);
  }
  );
