const express=require("express");
const cors=require("cors");
const mysql=require("mysql");
const jwt = require('jsonwebtoken');
const app=express();
app.use(cors())
app.use(express.json());

app.listen(9000,()=>{
    console.log("server is running on 9000")
})
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"authenticated_user_data",
    port:3306
})
connection.connect((err)=>{
    if(err){
        console.log("unable to connect to db",err)
    }
    else{
        console.log("connected to db")
    }
})




app.post("/SignUp",(req,res)=>{
    const {username,email,hashedPassword}=req.body;
    // console.log(req.body)


    const getSql="call get_user(?)"
    var user=null;
    connection.query(getSql,[username],(err,result)=>{
        if(err){
            res.status(400).send(err)
        }
        else if(result[0].length === 0){
            const sql="call insert_user_data(?,?,?)"
    

            connection.query(sql,[username,email,hashedPassword],(err,result)=>{
                if(err){
                    res.status(400).send(err)
                }
                else{
                    res.send(result)
                }
                
            })
        }
        else{
        
            res.send("user already exist")
        }
        
    })
   
}) 


app.post("/Login",(req,res)=>{
    const {loginUsername,loginHashedPassword}=req.body;
    const secret_key="my_jwt_token"
    // console.log(req.body)
    const userDetails={loginUsername,loginHashedPassword}

    const getSql="call get_user(?)"
    var user=null;
    connection.query(getSql,[loginUsername],(err,result)=>{
        if(err){
            res.status(400).send(err)
        }
        else if(result[0].length === 0){
            res.send("user not exists")
        }
        else{
        
            const existingPassword=result[0][0].password
            if(existingPassword===loginHashedPassword){
                const jwt_token=jwt.sign(userDetails,secret_key)
            
                res.send({
                    message:"login success",
                    jwt:jwt_token
                })
                
            }
            else{
                res.send("invalid password")
            }
        }
        
    })
   
}) 