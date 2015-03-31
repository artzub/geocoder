var express = require('express');
var router = express.Router();
var MultiGeocoder = require('multi-geocoder')
    , geocoder = new MultiGeocoder({
        //provider: 'google', //'yandex',
        coordorder: 'latlong',
        lang: 'en-US'
    });

/* GET home page. */
router.get('/', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (!req.query.address)
        res.json({
            status : "error 18"
        });

    geocoder.geocode([req.query.address])
        .then(handleGetCoordinate(res));
});

function handleGetCoordinate(res) {
    return function(result) {
        try {
            result = result.result;
            if (result && result.type === 'FeatureCollection' && result.features && result.features.length) {
                var latlng = result.features[0];

                if (latlng.geometry && latlng.geometry.coordinates) {
                    res.json({status : "OK", results: [{
                        geometry :{
                            location: latlng.geometry.coordinates
                        }
                    }]})
                }
                else {
                    res.json({
                        status : "error 40"
                    });
                }
            }
            else {
                res.json({
                    status : "error 46"
                });
            }
        }
        catch (e) {
            res.json({
                status: e.message
            })
        }
    }
}

module.exports = router;
