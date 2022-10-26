const jwt = require('jsonwebtoken');
const auth = require('../controllers/authController');
const EquipModel = require('../models/equipModel');


exports.getDepartments = async (req, res) => {

    console.log("getDepartments");
    let status = await auth.authenticateJWT(req, res);

    if (status.status === 200) {

        try {
            [allDeps] = await EquipModel.getDepartments();
            return res.status(200).json(allDeps);
        } catch (error) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting department list from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }


}

exports.getCategoriesByDep = async (req, res) => {

    console.log("getCategoriesByDep");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        try {
            [cats] = await EquipModel.getCategoriesByDep(req.params.id);
            console.log("cats:", cats);
            return res.status(200).json(cats);
        } catch (error) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting category by dep from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.getModelsByCat = async (req, res) => {

    console.log("getModelsByCat");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);
    let modelArr = [];

    if (status.status === 200) {

        try {
            [equip] = await EquipModel.getModelsByCat(req.params.idCat);
            // console.log("equip:", equip);
            equip.map(item => {
                console.log("item:", item);
                let model = new EquipModel(item, "short");
                console.log("model.onWarehouse:", model.quantity.onWarehouse);
                modelArr.push(model);
            });
            // console.log("modelArr:", modelArr);
            return res.status(200).json(modelArr);
        } catch (error) {
            // console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting equipment by dep and cat from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.getCategories = async (req, res) => {

    console.log("getCategories");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        try {
            [allCats] = await EquipModel.getCategories();
            console.log("allCats:", allCats);
            return res.status(200).json(allCats);
        } catch (error) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting category list from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.getModels = async (req, res) => {

    console.log("getModels");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);
    let q = "";
    modelArr = [];

    console.log("req.body:", req.body);

    let arr = req.body.map(item => item.id);
    console.log("arr:", arr);

    q = arr.reduce((accumulator, curVal) => {
        return accumulator + "'" + curVal + "',";
    }, '');

    q = q.slice(0, -1);
    q = "(" + q + ")";

    console.log("q:", q);

    // console.log(typeof (q));
    // console.log(typeof (arr));

    if (status.status === 200) {

        try {
            [equip] = await EquipModel.getModels(q);
            console.log("equip:", equip);
            equip.map(item => {
                // console.log("item:", item);
                let model = new EquipModel(item, "short");
                // console.log("model.onWarehouse:", model.quantity.onWarehouse);
                modelArr.push(model);
            });
            // console.log("modelArr:", modelArr);
            return res.status(200).json(modelArr);
        } catch (error) {
            // console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting models from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

    // res.status(200).json({msg:"ok"});
}

exports.getModel = async (req, res) => {
    console.log("getModels");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {
        const [models] = await EquipModel.getModel(req.params.id);
        console.log("models:", models);
        let model = new EquipModel(models[0]);
        return res.status(200).json(model);
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.searchModels = async (req, res) => {
    console.log("searchModels");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    modelArr = [];

    if (status.status === 200) {
        try {
            const [models] = await EquipModel.searchModel(req.query.s);
            console.log("models:", models);

            models.map(item => {
                let model = new EquipModel(item);
                modelArr.push(model);
            })
            return res.status(200).json(modelArr);

        } catch (error) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with searching equipment from database" });
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}