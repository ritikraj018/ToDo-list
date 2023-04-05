const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to to-do list."
});
const item2 = new Item({
    name: "Hit the + button to add new item."
});
const item3 = new Item({
    name: "<--Hit this to delete an item."
});

const dItems = [item1, item2, item3];


app.get("/", function (req, res) {
    Item.find()
        .then((foundItems) => {
            if (foundItems.length === 0) {
                Item.insertMany(dItems)
                    .then(() => {
                        console.log('Documents inserted successfully');
                    })
                    .catch((error) => {
                        console.error('Error inserting documents', error);
                    });
                res.redirect("/");
            }
            else {
                res.render("list", { ejsDay: "Today", itemList: foundItems });
            }
        })

        .catch((err) => {
            // handle error
            console.log(err);
        });
});

app.post("/", function (req, res) {
    const itemName = req.body.var1;
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

// app.get("/about", function (req, res) {
//     res.render("about");
// });

app.listen(3000, function () {
    console.log("Server is running on 3000");
});