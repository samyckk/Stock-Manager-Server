import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import billroute from './routes/bills.js';
import stockroute from './routes/stocks.js';


const app = express();

app.use(cors());

dotenv.config();

const connection = async () =>{
    const URL = process.env.MONGODBURL;
    try {
        console.log("trying to connect to mongoose");
        await mongoose.connect(URL);
        console.log("Connect Succcessfully to Database");
    } catch (error) {
        console.log("Error connecting to database", error);
    }

}
 
app.use(express.json());

app.set('trust proxy', 1);

app.use('/bills', billroute);
app.use('/stocks', stockroute);

app.get('/hey', (req, res) => {
    res.send("Hello world");
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log("connected to server!");
});

connection();