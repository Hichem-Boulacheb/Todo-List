import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DB_URL);

const port=3000;
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


const schema=new mongoose.Schema({
    name:String,
});

const Item=mongoose.model("items",schema);

const I1=new Item({
    name:"Welcome to my todoList",
})
const I2=new Item({
    name:"hit + button to add new item",
})
const I3=new Item({
    name:"hit this button to delete an item ---> ",
})
const defaultArray=[I1,I2,I3];

const listSchema=new mongoose.Schema({
    name:String,
    items:[schema]
})
const list=mongoose.model("lists",listSchema);


app.get("/",async(req,res)=>{
    const items = await Item.find();
    if(items.length===0){
        await Item.insertMany(defaultArray);
    }
    res.render("home.ejs",{day:daysOfWeek[date.getDay()],month:months[date.getMonth()],year:date.getDate(),tasks:items});
})

app.post("/add",async(req,res)=>{
    const list_item=req.body.list;
    const task=req.body.new_task;
    const item=new Item({
        name:task,
    })
    if(list_item==="today"){
        item.save();
        res.redirect("/");
    }else{
        const result=await list.findOne({name:list_item});
        console.log(result);
        result.items.push(item);
        result.save();
        res.redirect("/"+list_item);
    }
    
})
app.post("/remove",async(req,res)=>{
    const id_item_deleted=req.body.button;
    const list_item=req.body.list;
    console.log(list_item);
    if(list_item==="today"){
        await Item.deleteOne({_id:id_item_deleted});
        res.redirect("/");
    }else{
       const result=await list.findOneAndUpdate(
            { name: list_item }, {$pull: {items: {_id:id_item_deleted}}}, );
            res.redirect("/"+list_item);
    }
    
})
app.get("/:customList",async(req,res)=>{
    const result= await list.findOne({name:_.capitalize(req.params.customList)});
    if(!result){
        const default_list=new list({
            name:_.capitalize(req.params.customList),
            items:defaultArray
        })
        await default_list.save();
        res.render("home.ejs",{list:default_list.name,tasks:default_list.items});
    }else{
        res.render("home.ejs",{list:result.name,tasks:result.items});
    }
    
})


app.listen(port,()=>{
    console.log("your server in running on port "+port);
})

var date=new Date();
const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];




