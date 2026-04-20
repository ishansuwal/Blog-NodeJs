require('dotenv').config()
const express=require('express')
const ConnectToDatabase = require('./database')
const Blog = require('./model/blogModel')
const app=express()
app.use(express.json())

ConnectToDatabase()

app.get("/", (req, res)=>{
    res.json({
        message:"This is home page"
    })
})

app.post("/blog", async(req, res)=>{
    const {title, subtitle, description, image}=req.body
    //console.log(title, subtitle, description, image)
    if(!title || !subtitle ||!description ||!image){
        return res.status(400).json({
            message:"Please provide title, subtitle, description, image"
        })
    }
    await Blog.create({
        title: title,
        subtitle: subtitle,
        description: description,
        image: image
    })
        res.status(200).json({
        message:"Blog api hit successfully "
    })
})

app.listen(process.env.PORT, ()=>{
    console.log("NodeJs has started")
})

//mongodb+srv://ishansuwal7_db_user:<db_password>@cluster0.9zmmgud.mongodb.net/?appName=Cluster0