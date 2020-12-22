"use strict"

const app = require("./app");

//routes
const signUp = require("./routes/signup");
const login = require("./routes/login");
const admin = require("./routes/admin");
const buy = require("./routes/buy");
const rent = require("./routes/rent");
const sell = require("./routes/sell");
const search = require("./routes/search");
const openhouse = require("./routes/openhouse");
const saveAsFavorites = require("./routes/favorites");
const rentApplication = require("./routes/rentApplication");
 
app.get('/', (req, res) => res.send('Backend Test run successful!'));

//Endpoint Links
app.use("/signUp", signUp);
app.use("/login", login);
app.use("/admin", admin);
app.use("/buy", buy);
app.use("/rent", rent);
app.use("/sell", sell);
app.use("/search", search);
app.use("/addOpenHouse", openhouse);
app.use("/saveAsFavorites", saveAsFavorites);
app.use("/rentApplication", rentApplication);
  
app.listen(3001, () => {
  console.log(`Server listening on port 3001`);
});
  
module.exports = app;