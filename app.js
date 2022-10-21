//Section Set the variable
//for server and framework
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

//invoke the list of data
const restaurantList = require("./restaurant.json");

//server connection port
const port = 3000;

//Section Set template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Section Static file
app.use(express.static("public"));

//Section Routes setting
//todo set the route to list
app.get("/", (req, res) => {
  res.render("index", { restaurantList: restaurantList.results });
});

//todo set the route to the description of restaurant(params)
app.get("/restaurants/:restaurant_id", (req, res) => {
  // console.log(req.params.restaurant_id);
  const restaurantId = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  );

  // console.log(restaurantId);

  res.render("show", { restaurantInfo: restaurantId });
});

//todo set the route for search bar

//Section Express server start and listen
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
