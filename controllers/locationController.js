const jwt = require('jsonwebtoken');
const Location = require('../models/locationModel');
// const utils = require('../utils/utils');
const auth = require('../controllers/authController');
const trans = require('../models/transactionModel');


exports.createNewLocation = async (req, res) => {

    console.log("createNewLocation req.body:", req.body);

    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        if (!Object.hasOwnProperty.bind(req.body)('name')) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        if ((req.body.name.length < 1)) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        let locationRow = Location.destructObj(req.body);
        console.log("locationRow:", locationRow);

        try {

            const [location] = await Location.createNew(locationRow);
            console.log("result location:", location);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing location data to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        return res.status(200).json([{ msg: `Площадка добавлена` }, req.body]);


    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.getAllLocations = async (req, res) => {

    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {
        try {

            const [locations] = await Location.getAll();
            console.log("allLocations from db:", locations);
            res.status(200).json(locations);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting event data from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.updateLocation = async (req, res) => {

    console.log("updateLocation req.body:", req.body);
    console.log("updateLocation id:", req.params.id);

    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        if (!Object.hasOwnProperty.bind(req.body)('name')) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        if ((req.body.name.length < 1)) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        let locationRow = Location.destructObj(req.body);
        locationRow.push(parseInt(req.params.id));
        console.log("locationRow:", locationRow);

        try {

            const [location] = await Location.updateRow(locationRow);
            console.log("result location:", location);

        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with update location data in database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        return res.status(200).json([{ msg: `Площадка обновлена` }, req.body]);


    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.createTransaction = async (req, res) => {

    console.log("createNewLocation req.body:", req.body);

    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        if (!Object.hasOwnProperty.bind(req.body)('name')) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        if ((req.body.name.length < 1)) {
            return res.status(500).json({ msg: "Отсутствует название площадки!" });
        }

        let locationRow_1 = Location.destructObj(req.body);
        console.log("locationRow_1:", locationRow_1);

        let locationRow_2=[];
        locationRow_1.map(el=> {
            
            locationRow_2.push(el + "_2");
        });
        console.log("locationRow_2:", locationRow_2);

        try {

        const result = await trans.addLocation(locationRow_1,locationRow_2);
            // const [location] = await trans.createNew(locationRow);
            // console.log("result location:", location);
            return res.status(200).json([{ msg: `Площадка добавлена` }, result]);
            // return res.status(200).json([{ msg: `Площадка добавлена` }, req.body]);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with writing location data to database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        // return res.status(200).json([{ msg: `Площадка добавлена` }, req.body]);


    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}