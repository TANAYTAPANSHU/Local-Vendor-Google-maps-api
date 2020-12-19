const { default: Axios } = require('axios');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose');
const Store = require('./api/models/stores.js');
const axios = require('axios');
const GoogleMapsService = require('./api/services/googleMapsService');
const googleMapsService = new GoogleMapsService();
require('dotenv').config();

mongoose.connect('mongodb+srv://tanay_tapanshu:tanay123@cluster0.lipau.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*")
    next();
})

app.use(express.json({ limit: '50mb' }));

app.post("/api/stores", (req, res) => {
    let dbStores = [];
    let stores = req.body;
    stores.forEach(store => {

        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatustext: store.openStatustext,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    });


    Store.create(dbStores, (err, stores) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }


    })





})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(err);
    })



    res.status(200).send("You have deleted successfully")
})

/*app.get('/api/stores', (req, res) => {
    const zipCode = req.query.zip_code;
    const googleMapsURL = "https://maps.googleapis.com/maps/api/geocode/json";
    axios.get(googleMapsURL, {
        params: {
            address: zipCode,
            key: "AIzaSyCFURETwuQ71FmExFaFCa7SBp4oqAgiiE8"
        }
    }).then((res) => {
        const data = res.data;
        console.log(data);
        const coordinates = [
            data.results[0].geometry.location.lng,
            data.results[0].geometry.location.lat
        ]


    }).catch((error) => {
        console.log(error);
    })

    Store.find({
        location: {
            $near: {
                $maxDistance: 2000,
                $geometry: {
                    type: "Point",
                    coordinates: coordinates
                }

            }
        }

    }, (err, stores) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(stores);
        }

    }).catch((err) => { console.log(err) });


})

 */

app.get('/api/stores', (req, res) => {
    const zipCode = req.query.zip_code;

    googleMapsService.getCoordinates(zipCode).then((coordinates) => {
        Store.find({
            location: {
                $near: {
                    $maxDistance: 2000,
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
                    }

                }
            }
        }, (err, stores) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(stores);
            }
        })
    })

})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})