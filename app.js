require('dotenv').config()
const express=require('express')
const ConnectToDatabase = require('./database')
const Blog = require('./model/blogModel')
const app=express()
app.use(express.json())
const {multer, storage}=require('./middleware/multerConfig')
const upload=multer({storage: storage})
const fs=require('fs')
const cors=require('cors')

app.use(cors({
    origin:"http://localhost:5173"
}))

ConnectToDatabase()

app.get("/", (req, res)=>{
    res.json({
        message:"This is home page"
    })
})

app.post("/blog", upload.single('image'), async(req, res)=>{
    const {title, subtitle, description}=req.body
    let filename
    if(req.file){
        filename=req.file.filename
    }
    else{
        filename='https://thumbs.dreamstime.com/b/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available-236105299.jpg?w=768'
    }
    const image=filename
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
        image: image,
    })
        res.status(200).json({
        message:"Blog api hit successfully "
    })
})

app.get("/blog", async(req,res)=>{
   const blogs=await Blog.find() //returns array
   if(blogs.length==0){ // we cannot use !blogs to check if it is empty because this is an array
    return res.status(404).json({
        message:"No Blogs found"
    })
   }
   res.status(200).json({
    message:"Blogs fetched successfully",
    data:blogs
   })
})

app.get("/blog/:id", async(req,res)=>{
    const id=req.params.id
    const blog=await Blog.findById(id)
    if(!blog){
        return res.status(404).json({
            message:"Blog not found"
        })
}
    res.status(200).json({
        message:"Blog fetched successfully",
        data:blog
    })
})

app.delete("/blog/:id", upload.single('image'), async(req,res)=>{
    const id = req.params.id
    const blog=await Blog.findById(id) 
    await Blog.findByIdAndDelete(id)
    fs.unlink(`./storage/${blog.image}`,(err)=>{
        if(err){
                console.log(err)
        }
        else{
            console.log("File deleted successfully.")
        }
    })
    res.status(200).json({
        messsage:"Blog deleted successfully."
    })
})

app.patch("/blog/:id", upload.single('image'), async(req,res)=>{
    const id=req.params.id
    const {title, subtitle, description}=req.body
    let imageName;
    if(req.file){
        imageName=req.file.filename
        const blog=await Blog.findById(id) 
        const oldImage=blog.image

        fs.unlink(`./storage/${oldImage}`,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("File deleted successfully.")
            }
    })
    }
    await Blog.findByIdAndUpdate(id,{
        title: title,
        subtitle: subtitle,
        description: description,
        image: imageName
    })
    res.status(200).json({
        message:"Blog updated successfully."
    })
})

app.use(express.static('./storage'))


app.listen(process.env.PORT, ()=>{
    console.log("NodeJs has started")
})
