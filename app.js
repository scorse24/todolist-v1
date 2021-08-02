const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
//const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-shikhar:78645910@cluster0.gemdv.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("item", itemsSchema);
//const items = ["buy food"];
//const workItems = [];

const item1 = new Item({
    title: "buy food"
});

const item2 = new Item({
    title: "cook food"
});

const item3 = new Item({
    title: "eat food"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("list", listSchema);

app.get("/", function(req, res){
    
    //let day = date.getDate();

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("success");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.post("/", function(req, res){
    
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const item = new Item({
        title: itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("success");
            res.redirect("/");
        }
    });
}else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
        if(!err){
            res.redirect("/" + listName)
        }
    });
}
});

app.get("/:pathName", function(req, res){
    const dynamicRoute = _.capitalize(req.params.pathName);

    List.findOne({name: dynamicRoute}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: dynamicRoute,
                    items: defaultItems
                });
            
                list.save();
                res.redirect("/" + dynamicRoute);
            }else{
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });

});

// app.post("/work", function(req, res){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// });

app.listen(process.env.PORT, function(){
    console.log("server started on port 3000");
});