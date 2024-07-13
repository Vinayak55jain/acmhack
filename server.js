const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vinayakjainlife:suddendeath123%40@cluster0.efw6gnu.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const binSchema = new mongoose.Schema({
    location: String,
    blueBinSize: Number,
    greenBinSize: Number,
    redBinSize: Number
});

const Bin = mongoose.model('Bin', binSchema);

app.get('/bins/:location', async (req, res) => {
    const location = req.params.location;
    try {
        const bin = await Bin.findOne({ location: location });
        if (bin) {
            res.json(bin);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/bins/:location', async (req, res) => {
    const location = req.params.location;
    const { blueBinSize, greenBinSize, redBinSize } = req.body;
    try {
        let bin = await Bin.findOne({ location: location });
        if (bin) {
            bin.blueBinSize = blueBinSize;
            bin.greenBinSize = greenBinSize;
            bin.redBinSize = redBinSize;
            await bin.save();
        } else {
            bin = new Bin({ location, blueBinSize, greenBinSize, redBinSize });
            await bin.save();
        }
        res.json(bin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const port = 3000;
app.get('/', (req, res) => {
    res.send("I am live");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
