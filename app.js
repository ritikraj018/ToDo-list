const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let uri = 'mongodb+srv://rr4673:1234@cluster0.kptlkmc.mongodb.net/?retryWrites=true&w=majority'
//connect database
mongoose.connect(uri);

//create database schema
const itemSchema = {
    name: String
};
//create model
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

//array of items
const dItems = [item1, item2, item3];

//schema for custom list (work or home)
const listSchema = {
    name: String,
    items: [itemSchema]
};

//model for custom list
const List = mongoose.model("List", listSchema);


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

//custom list
app.get("/:customList", function (req, res) {
    const customListName = _.capitalize(req.params.customList);
    //find list with same name
    List.findOne({ name: customListName }).exec()
        .then(foundList => {
            if (!foundList) {
                //if does not exists then add new list
                const list = new List({
                    name: customListName,
                    items: dItems
                });
                list.save();
                //redirect to same location again to show the list
                res.redirect("/" + customListName);
            } else {
                //if already exists then render it using list.ejs
                res.render("list", { ejsDay: foundList.name, itemList: foundList.items });
            }
        })
        .catch(err => {
            console.error(err);
        });
});

//
app.post("/", function (req, res) {
    const itemName = req.body.var1;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).exec()
            .then(foundList => {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch(err => {
                console.log(err);
            });
    }

});

// delete item by cliciking checkbox
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then((user) => {
                console.log("Item Deleted");
            })
            .catch((err) => {
                console.error(err);
            });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
            .then(foundList => {
                res.redirect("/" + listName);
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.listen(3000, function () {
    console.log("Server is running on 3000");
});