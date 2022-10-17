const auth = require('../controllers/authController');
const DayDetails = require('../models/dayDetailsModel');


exports.getDayDetails = async (req, res) => {
    console.log("getDayDetails");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let idModel = req.query.idModel;
    let idWh = req.query.idWh
    let date = req.query.date.slice(0,10);

    if (status.status === 200) {
        try {
            const [details] = await DayDetails.getDayDetails(idModel, idWh, date);
            console.log("details:", details);
            let eventDayArr = [];
            details.map(item => {
                let eventDay = new DayDetails(item);
                eventDayArr.push(eventDay);
            })

            return res.status(200).json(eventDayArr);
        } catch (error) {
            console.log("error:", error);
            return res.status(500).json({ msg: "We have problems with getting day details by idModel, idWh and date from database" });
        }
    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}