const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ampetqi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollections = client.db('restaurantGuide').collection('services')
        const addserviceCollections = client.db('restaurantGuide').collection('addservice')
        const reviewCollections = client.db('restaurantGuide').collection('review')

        app.get('/services',async (req,res)=>{
            const query = {}
            const cursor = serviceCollections.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get('/allservices',async (req,res)=>{
            const query = {}
            const cursor = serviceCollections.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })
        app.get('/services/:id',async (req,res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const services = await serviceCollections.findOne(query)
            res.send(services)
        })
        app.get('/addservice',async (req,res)=>{
            const query = {}
            const services = await addserviceCollections.find(query).toArray()
            res.send(services)
        })
        app.post('/addservice',async (req,res)=>{
            const query = req.body
            const services = await addserviceCollections.insertOne(query)
            res.send(services)
        })
        app.post('/review',async (req,res)=>{
            const query = req.body
            const review = await reviewCollections.insertOne(query)
            res.send(review)
        })
    }
    finally{

    }
}
run().catch(err => console.error(err))
app.get('/',(req,res)=>{
    res.send('restaurant guide server is running')
})

app.listen(port,(req,res)=>{
    console.log('restaurantv guide')
})