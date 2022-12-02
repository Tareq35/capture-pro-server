const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare------------------------------------------------------------------>
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.x8ynutp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// JSON Web Token Here------------------------------------------------------------------------->
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}


async function run(){
    try{
        

    }
    finally{

    }
}
run().catch(e => console.error(e));

app.get('/', (req, res)=>{
    res.send('Personal Portfolio Data Are Coming..........!!!')
})
app.listen(port, ()=>{
    console.log(`Your Available Port Are-------->${port}`)
})
 module.exports = app;
