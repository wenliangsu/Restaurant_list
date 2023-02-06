//Section Database setting and connection
//set the variable
const mongoose = require("mongoose");

//note 非正式環境時使用dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//note 可直接使用mongoDB的連線位址: mongoose.connect('<mongoDB的連線url>')
mongoose.connect(process.env.MONGO_URL, {
  // note 版本6.0之後可以不用加入這三個
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
//database connect status
db.on("error", () => {
  console.log("mongoDB error");
});
db.once("open", () => {
  console.log("mongoDB connected!");
});

module.exports = db;
