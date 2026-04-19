require('dotenv').config()
const express=require('express')
const ConnectToDatabase = require('./database')
const app=express()
app.use(express.json())

ConnectToDatabase()

app.get("/", (req, res)=>{
    res.json({
        message:"This is home page"
    })
})

app.post("/blog", (req, res)=>{
    res.status(200).json({
        message:"Blog api hit successfully "
    })
    console.log(req.body)
})

app.listen(process.env.PORT, ()=>{
    console.log("NodeJs has started")
})

//mongodb+srv://ishansuwal7_db_user:<db_password>@cluster0.9zmmgud.mongodb.net/?appName=Cluster0