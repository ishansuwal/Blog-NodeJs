const mongoose=require('mongoose')
async function ConnectToDatabase(){
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected successfully")
}

module.exports=ConnectToDatabase