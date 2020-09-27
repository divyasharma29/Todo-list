const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

console.log(date);

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-divya:Test123@cluster0.pha0a.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

app.use(express.static("public"));

//view is a folder name which should be there in the main directory where we add our EJS Files.
const itemSchema = new mongoose.Schema({
    name: String
});


const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist"
});
const item2 = new Item({
    name: "Hit + button to enter new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);


var workItems = [];
app.get("/", function(req , res){
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Default Item inserted successfully");
                    res.redirect("/");
                }
            });
               
        }else{
            res.render("list", {listTitle: "Today" , newListItems : foundItems});
        }
        });
    
});

app.post("/" , function(req, res) {
    let itemName = req.body.itemName;
    let listName = req.body.list;

    const newItem = new Item({
        name: itemName
    });

    if(listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", function(req, res){
    const checkedID = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){
    Item.findByIdAndRemove(checkedID, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted Successfully");
            res.redirect("/");
        }
    });
}else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedID }}} , function(err, foundList){
    if(!err){
        res.redirect("/"+listName);
    }});
}
});

// app.get("/work" , function(req, res){
//     res.render("list" , {listTitle: "Work List" , newListItems: workItems});
// });

// app.get("/about" , function(req, res){
//     res.render("about");
// });

app.get("/:itemListName", function(req, res){
    const customListName = _.capitalize(req.params.itemListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //console.log("List Not Found");
                //Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultItems
                 });
                 list.save();
                 res.redirect("/" + customListName);
                 
            } else{
                //console.log("List Found");
                //Show an existing list

                res.render("list", {listTitle: foundList.name , newListItems : foundList.items});
            }
        }
    })
    
    
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);


app.listen(port , function(){
    console.log("Server is running at 3000");
});



// app.get("/", function(req , res){
    
//     // var today = new Date();//To get todays date
//     // //var day = ""
//     // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     //var bday = new Date('August 19, 1998 23:32:43');//To pass a particular date
    
//     // var currentDay = today.getDay();
    
//     // if(currentDay === 6 || currentDay === 0){
//     //     day = "Weekend"
//     // }else{
//     //     day = "Weekday"
//     // }

//     //var day = date();

//     Item.find({}, function(err, foundItems){
//         if(foundItems.length === 0){
//             Item.insertMany(defaultItems, function(err){
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.log("Default Item inserted successfully");
//                 }
//             });
//             res.redirect("/");
//         }else{
//         res.render("list", {listTitle: "Today" , newListItems : foundItems});
//         }
//     });


//     //res.render("list", {listTitle: "Today" , newListItems : items});
//     // , OfDay: days[currentDay] ,
//  //We can call this only one time nd need to specify all the var here and declare thm in the begining.

// });

// app.post("/" , function(req, res) {
// let itemName = req.body.itemName;
// console.log(req.body);
// if(req.body.list === "Work"){//Here it takes only first string of listTitle
//     workItems.push(itemName);
//     res.redirect("/work")
// }else{
// items.push(itemName);
// res.redirect("/");
// }
// });

// app.get("/work" , function(req, res){
// res.render("list" , {listTitle: "Work List" , newListItems: workItems});
// });

// app.get("/about" , function(req, res){
// res.render("about");
// });



////// https://shrouded-stream-96124.herokuapp.com link for it
