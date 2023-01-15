const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const port = 5000;
dotenv.config();
app.use(cors())

// const MONGODB_URI = "mongodb+srv://kiisifelix:kiisifelix2006@movix.mmil1zi.mongodb.net/user?retryWrites=true&w=majority";
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("connected")).catch(error => console.log(error));


app.use(express.json({extended: true}))
app.use(express.urlencoded({extended: true}));

app.use(require("./routes/auth_routes"))

app.get('/', (req, res) =>{
    return res.status(201).json({data: "Welcome"})
})


app.listen(port, ()=> console.log(`Server running on port: ${port}`))