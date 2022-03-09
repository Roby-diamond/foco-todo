const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config();

const { PORT, MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL)

mongoose.connection
    .on('open', () => console.log("Mongoose is connected"))
    .on('close', () => console.log('Mongoose is disconnected'))
    .on('error', (error) => console.log(error));

// MODELS //

    const BrewerySchema = new mongoose.Schema({
        name: String,
        image: String,
        address: String,
        website: String
    }, {timestamps: true});
    
    const Breweries = mongoose.model('Breweries', BrewerySchema)
 
// MIDDLEWARE //    

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// ROUTES //

app.get('/', (req, res) => {
    res.send('hello world')
});


app.get('/breweries', async (req, res) => {
    try {
        res.json(await Breweries.find({}));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.post('/breweries', async (req, res) => {
    try {
        res.json(await Breweries.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

app.delete('/breweries/:id', async (req, res) => {
    try {
        res.json(await Breweries.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
})

app.put('/breweries/:id', async (req, res) => {
    try {
        res.json(await Breweries.findByIdAndUpdate(req.params.id, req.body, {new:true}))
    } catch (error) {
        res.status(400).json(error);
    }
})


app.listen(PORT, () => console.log(`listening on port ${PORT}`))