const express =require("express");
const app =express();
const morgan =require("morgan");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
const multer =require("multer");



const productRoutes = require("./api/routes/products");
const orderRoutes =require("./api/routes/orders");
const userRoutes =require('./api/routes/user')


mongoose.connect("mongodb://localhost/node_shop",{useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex :true});
// mongoose.Promise=global.Promise;
app.use(morgan("dev"));      //use for error handelling
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true,async:true}));
app.use(bodyParser.json());
app.set("view engine","ejs");



/////Handling CORS///////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-with,Content-Type,Accept,Authorization"
        );
        if(req.method==="OPTIONS"){
            res.header("Access-Control-Allow-Methods","PUT","POST","PATCH","DELETE","GET");
            return res.status(200).json({});
        }
        next();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/user",userRoutes);



app.use((req,res,next)=>{
    const error=new Error("Not Found!!!!");
    error.status= 404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
});
module.exports =app;