const jwt = require('jsonwebtoken');
const BookCalendarEquip = require('../models/bookCalendarModel');
const auth = require('../controllers/authController');


exports.getAll = async (req, res) => {

    console.log("getAllEvents");


    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let modelsArr = [];
    // let allEvents;
    let phases;
    let equip;

    if (status.status === 200) {

        try {

            const [models] = await BookCalendarEquip.getModels();
            // console.log("all models from calendar:", models);

            const row = [];
            const map = new Map();
            for (const item of models) {
                if (!map.has(item.idModel)) {
                    map.set(item.idModel, true);
                    row.push({
                        idModel: item.idModel,
                        manufactor: item.manufactor,
                        name: item.name,
                        all: item.all,
                        currentWh: item.currentWh
                    });
                }
            }
            // console.log("row:", row);
            row.map(item => {
                let dateArr = [];
                let dateObj = {};

                let model = new BookCalendarEquip(item);
                // console.log("book model:", model);

                let date = models.filter(elem => {
                    if (elem.idModel === item.idModel) {
                        return true;
                    }
                });

                console.log("date:", date);

                date.map(el => {
                    dateObj = {};
                    dateObj.day = el.day;
                    dateObj.inWork = el.inWork;
                    dateObj.inWorkQuest = el.inWorkQuest;
                    dateObj.inWorkApproved = el.inWorkApproved;
                    dateObj.inTransport = el.inTransport;
                    dateObj.availApproved = el.availApproved;
                    dateObj.availQuest = el.availQuest;

                    console.log("dateObj:", dateObj);

                    dateArr.push(dateObj);

                });

                console.log("dateArr:", dateArr);

                model.bookDate = dateArr;

                // console.log("dateArr:", dateArr);
                console.log(model);
                modelsArr.push(model);

            })

            // return res.status(200).json({ msg: "ok" });
            return res.status(200).json(modelsArr);


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

exports.getModelsByCatWhPeriod = async (req, res) => {
    let modelsArr = [];
    let filteredAllModels = [];
    console.log("getModelsByCatWhPeriod");
    console.log("idCat:", req.query.cat);
    console.log("idWh:", req.query.wh);
    const start = req.query.start.slice(0, 10);
    const end = req.query.end.slice(0, 10);
    console.log("start:", start);
    console.log("end:", end);


    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {

        try {

            let [allModels] = await BookCalendarEquip.getAllModelsByCat(req.query.cat, req.query.wh);
            console.log("allModels:", allModels);
            const [models] = await BookCalendarEquip.getModelsByCatWhPeriod(req.query.cat, req.query.wh, start, end);
            console.log("models:", models);
            const row = [];
            const map = new Map();
            let arr = [];
            for (const item of models) {

                if (!map.has(item.idModel)) {
                    map.set(item.idModel, true);

                    allModels.filter(obj => {

                        if (obj.idModel === item.idModel) {
                            // console.log("obj.idModel:", obj.idModel);
                            arr.push(obj.idModel);
                            return true;
                        }
                    });  //  remove from allModels    

                    row.push({
                        idModel: item.idModel,
                        manufactor: item.manufactor,
                        name: item.name,
                        qtyAll: item.qtyAll,
                        currentWh: item.currentWh
                    });
                }
            }

            console.log("arr:", arr);
            // console.log("arrLength:", arr.length);
            // console.log("allModels:", allModels);
            // console.log("allModelsLength:", allModels.length);

            filteredAllModels = [];

            allModels.forEach(element => {

                if (!arr.includes(element.idModel)) {
                    filteredAllModels.push(element);
                }
            })

            console.log("filteredAllModels:", filteredAllModels);
            // console.log("models:", models);

            row.map(item => {
                let dateArr = [];
                let dateObj = {};
                // console.log("item:", item);
                let model = new BookCalendarEquip(item);
                // console.log("book model:", model);

                let date = models.filter(elem => {
                    if (elem.idModel === item.idModel) {
                        return true;
                    }
                });

                // console.log("date:", date);

                date.map(el => {
                    dateObj = {};
                    dateObj.day = el.day;
                    dateObj.inWork = el.inWork;
                    dateObj.inWorkQuest = el.inWorkQuest;
                    dateObj.inWorkApproved = el.inWorkApproved;
                    dateObj.inTransport = el.inTransport;
                    dateObj.availApproved = el.availApproved;
                    dateObj.availQuest = el.availQuest;

                    // console.log("dateObj:", dateObj);

                    dateArr.push(dateObj);

                });

                // console.log("dateArr:", dateArr);

                model.bookDate = dateArr;

                // console.log("dateArr:", dateArr);
                // console.log(model);
                modelsArr.push(model);

            })

            filteredAllModels.map(item => {
                let modelNoBook = new BookCalendarEquip(item);
                // console.log("modelNoBook:",modelNoBook);
                modelNoBook.bookDate = [];
                modelsArr.push(modelNoBook);
            })

            return res.status(200).json(modelsArr);

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

    // return res.status(200).json({ msg: "ok" });

}

exports.searchModelByWhPeriod = async (req, res) => {
    let modelsArr = [];
    let dateArr = [];
    console.log("searchModelByWhPeriod");
    console.log("searchStr:", req.query.s);
    console.log("idWh:", req.query.wh);
    const start = req.query.start.slice(0, 10);
    const end = req.query.end.slice(0, 10);
    console.log("start:", start);
    console.log("end:", end);

    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {
        try {
            const [models] = await BookCalendarEquip.searchModelByWhPeriod(req.query.s, req.query.wh, start, end);
            console.log("models:", models);

            models.map(item => {

                let model = new BookCalendarEquip(item);

                // let date = models.filter(elem => {
                //     if (elem.idModel === item.idModel) {
                //         return true;
                //     }
                // });

                // console.log("date:", date);

                // date.map(el => {
                //     dateObj = {};
                //     dateObj.day = el.day;
                //     dateObj.inWork = el.inWork;
                //     dateObj.inWorkQuest = el.inWorkQuest;
                //     dateObj.inWorkApproved = el.inWorkApproved;
                //     dateObj.inTransport = el.inTransport;
                //     dateObj.availApproved = el.availApproved;
                //     dateObj.availQuest = el.availQuest;

                //     // console.log("dateObj:", dateObj);

                //     dateArr.push(dateObj);

                // });
                // model.bookDate = dateArr;
                modelsArr.push(model);
            });
            console.log("modelsArr:",modelsArr);
            return res.status(200).json(modelsArr);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting search models from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}


