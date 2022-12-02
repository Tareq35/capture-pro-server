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
        const serviceCollection = client.db("userReview").collection('services');
        const reviewCollection = client.db("userReview").collection("reviews");

        // JSON Web Token
        app.post("/jwt", (req, res)=>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
              expiresIn: "1d",
            });
            res.send({token});
        })

        // Home Page Display Services-------------------------------------------------->
        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({"date": -1}).limit(3).toArray();
            res.send(services);
        })

        // Show Details Page Display Services---------------------------------------------->
        app.post('/services', async(req, res)=>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.sort({"date": -1}).toArray();
            res.send(services);
        })

        // Uniq Service for Uniq Data------------------------------------------------------------>
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        app.post("/review", async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // Get Review ServiceName based---------------------------------------------------------->
        app.get("/review", async(req,res)=>{
            let query = {};
            if(req.query.serviceName){
                query = {
                  serviceName : req.query.serviceName,
                };
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        

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
