const express=require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
var _ = require('lodash');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://shobit1502:shobit1502@shobitmasterpiece.6bnphql.mongodb.net/todolistDB?retryWrites=true&w=majority');
const getDate=require(__dirname+"/date.js");
const app=express();
app.use(express.static('public'));
// const items=[];
//const workItems=[];
app.use(bodyParser.urlencoded({extended:true}));
const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

app.set("view engine", "ejs");
const itemSchema=mongoose.Schema({
    name:String
})
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({
    name :"Welcome to your todolist."
})
const item2=new Item({
    name :"Hit + button to add things to list."
})
const item3=new Item({
    name :"<= Check this box in order to delete entry."
})
const defaultItems=[item1,item2,item3];
const listSchema=mongoose.Schema({
    name:String,
    items:[itemSchema]
})
const List=mongoose.model("List",listSchema);
app.get("/",function(req,res){
    const day=getDate();
    Item.find(function(err,items){
        if(items.length==0){
            Item.insertMany(defaultItems,function(err){
                if(err)console.log(err);
            })
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",items:items});
        }
    })
    
})

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,result){
        if(err){
            console.log(err);
        }else{
            if(!result){
                const list=new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save();
                res.redirect("/"+customListName);
            }else{
                console.log("Already there buddy");
                res.render("list",{listTitle:customListName,items:result.items});
            }
        }
    })
    
    
})
app.get("/about",function(req,res){
    
    res.render("about");
})
app.post("/",function(req,res){
    const newItem=req.body.newItem;
    const listTitle=req.body.list;
    console.log(listTitle);
    const item=new Item({
        name:newItem
    })
    if(listTitle=="Today"){
       
        item.save().then(() => console.log('Item Added'));
        res.redirect("/");
    }
    else{
        List.findOne({name:listTitle},function(err,result){
            if(err){
                throw err;
            }
            else{
                result.items.push(item)
                result.save();
                res.redirect("/"+listTitle);

            }
        })
    }
    
})
app.post("/delete",function(req,res){
    const id=req.body.id;
    const listName=req.body.listName;
    if(listName=="Today"){
        Item.findByIdAndDelete(id,function (err) {
            if(err)console.log(err);
            else console.log(id+" Deleted suceesffully");
        })
        res.redirect("/");
    }
    else{
        List.updateMany({name:listName},
            {$pull:{items:{_id:id}}},function(err,foundList){
                if(!err)console.log(foundList);
                else console.log(err);
            });
        res.redirect("/"+listName);

    }
    
})
// app.post("/work",function(req,res){
//     var newItem=req.body.newItem;
//     workItems.push(newItem);
//     res.redirect("/work");
// })

app.listen(3000,function(req,res){
    console.log("Server started on port 3000");
})