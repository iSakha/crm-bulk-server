const jwt = require('jsonwebtoken');
const Event = require('../models/eventModel');
const Phase = require('../models/phaseModel');
const BookEquipment = require('../models/bookEquipModel');
const Notification = require('../models/notificateModel');
const auth = require('../controllers/authController');
const trans = require('../models/transactionEventModel');

exports.getAll = async (req, res) => {

    console.log("getAllEvents");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let allEventsArr = [];
    // let allEvents;
    let phases;
    let equip;

    if (status.status === 200) {

        try {

            const [events] = await Event.getAll();
            console.log("allEvents from db:", events);

            try {
                [phases] = await Phase.getAllPhase();
                console.log("phases:", phases);


            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with getting phase data from database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            try {
                [equip] = await BookEquipment.getAllEquip();
                console.log("equip:", equip);


            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with getting phase data from database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            events.map(item => {
                let event = new Event(item);

                let filterPhaseArr = phases.filter(elem => {
                    if (elem.idEvent === item.idEvent) {
                        return true;
                    };
                });

                let filterEquipArr = equip.filter(elem => {
                    if (elem.idEvent === item.idEvent) {
                        return true;
                    };
                });

                if (filterPhaseArr.length > 0) {
                    let eventPhaseArr = [];
                    filterPhaseArr.map(item => {
                        let phase = new Phase(item);
                        eventPhaseArr.push(phase);
                    })
                    event.phase = eventPhaseArr;
                } else event.phase = [];

                if (filterEquipArr.length > 0) {
                    let eventEquipArr = [];
                    filterEquipArr.map(item => {
                        let model = new BookEquipment(item);
                        eventEquipArr.push(model);
                    })
                    event.booking = eventEquipArr;
                } else event.booking = [];

                allEventsArr.push(event);
            });



            // return res.status(200).json({ msg: "ok" });
            return res.status(200).json(allEventsArr);


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

exports.getAllShort = async (req, res) => {

    console.log("getAllShort");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    let allEventsArr = [];

    if (status.status === 200) {

        try {

            const [events] = await Event.getAll();
            console.log("allEvents from db:", events);

            [equip] = await BookEquipment.getEventDeps();
            console.log("short equip:", equip);

            events.map(item => {
                let event = new Event(item);

                let depRow = [];
                equip.map(elem => {
                    if (event.id === elem.idEvent) {
                        depRow.push(elem.dep);
                    }
                })

                console.log("event.id:", event.id);
                console.log("depRow:", depRow);

                event.deps = depRow;

                allEventsArr.push(event);
            });

            // return res.status(200).json({ msg: "ok" });
            return res.status(200).json(allEventsArr);


        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting short event data from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

    } else {
        return res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }


}

exports.getOne = async (req, res) => {
    let phases;
    let equip;
    // let eventObj = {};


    console.log("getOne");
    let status = await auth.authenticateJWT(req, res);

    console.log("statusCode:", status);

    if (status.status === 200) {

        let phaseArr = [];
        let equipArr = [];

        try {
            const [event] = await Event.getOne(req.params.id);
            // console.log("event:", event);
            if (event.length < 1) {
                res.status(200).json({ msg: `Мероприятия с id = ${req.params.id} не существует` });
                return;
            }


            try {
                [phases] = await Phase.getOne(req.params.id);
                if (phases.length > 0) {
                    phases.map(item => {
                        let phase = new Phase(item);
                        phaseArr.push(phase);
                    })
                } else phaseArr = [];


            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with getting phase from database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            try {
                [equip] = await BookEquipment.getOne(req.params.id);
                if (equip.length > 0) {
                    equip.map(item => {
                        let bookEquip = new BookEquipment(item);
                        equipArr.push(bookEquip);
                    })
                } else equipArr = [];
            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with getting booking from database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            let eventObj = new Event(event[0]);
            eventObj.phase = phaseArr;
            eventObj.booking = equipArr;


            return res.status(200).json(eventObj);

            // eventObj = new Event(req.params.id, event[0]);

            // [phases] = await Phase.getOnePhase(req.params.id);
            // console.log("phases:", phases);
            // [booked] = await BookedEquip.getBookedModelsByEventID(req.params.id);
            // console.log("booked:", booked);
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting event from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }

        // if (phases.length > 0) {
        //     eventObj.phase = phases;
        //     console.log("event+phase:", eventObj);
        // } else {
        //     eventObj.phase = [];
        // }

        // if (booked.length > 0) {
        //     console.log("booked before map:", booked);
        //     booked.map(item => {
        //         delete item.idEvent;
        //     })
        //     console.log("booked after map:", booked);
        //     eventObj.booking = booked;
        //     console.log("event+booking:", eventObj);
        //     console.log("event+booking:", eventObj);
        // } else {
        //     eventObj.booking = [];
        // }







    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }

}

exports.createTrans = async (req, res) => {

    console.log("createNewEvent req.body:", req.body);

    const rb = Object.assign({}, req.body);

    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let unixTime = Date.now();
    let eventRow = [];
    let phaseArr = [];
    let bookEquipArr = [];
    let bookCalendarArr = [];
    let responseDB;
    let msg;

    if (status.status === 200) {

        let result = checkEventBodyValid(req.body);
        if (result[0].valid === true) {
            req.body = checkEventPhase(req.body);
            req.body = checkEventBooking(req.body);
        } else return res.status(500).json(result[1].msg);


        console.log("authentication successfull!");

        req.body.id = createEventId();
        rb.id = req.body.id;
        req.body.creator = {};
        req.body.creator.id = userId;
        req.body.unixTime = unixTime;

        if (req.body.phase.length > 0) {

            phaseArr = Phase.destructObj(req.body.phase, req.body.id, userId, unixTime);
            req.body.phase = phaseArr;
            console.log("==============   phase   ==============");
        }

        if (req.body.booking.length > 0) {
            let block = 0;
            if (req.body.block === 1) {
                block = 1;
            }

            bookEquipArr = BookEquipment.destructObj(req.body.booking, req.body.id, req.body.warehouse.id, userId, unixTime, block);
            console.log("bookEquipArr from destruct:", bookEquipArr);
            req.body.booking = bookEquipArr;
            console.log("================   booking   ============");
            let dateStart = new Date(req.body.time.start.slice(0, 10));
            let dateEnd = new Date(req.body.time.end.slice(0, 10));
            // console.log("createDaysArray:", createBookArray(dateStart, dateEnd, req.body));
            if (req.body.phase.length > 0) {
                bookCalendarArr = createBookArray(dateStart, dateEnd, req.body);
                console.log("bookEquipArr:", bookEquipArr);
            }
        }

        eventRow = Event.destructObj(req.body);

        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("create");
        notifyRow.push("event");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouse.id);
        notifyRow.push(unixTime);

        try {

            if (req.body.phase.length > 0) {
                if (req.body.booking.length > 0) {
                    responseDB = await trans.createEventFull(eventRow, phaseArr, bookEquipArr, bookCalendarArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                } else {
                    responseDB = await trans.createEventPhase(eventRow, phaseArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.booking = [];
                }
            } else {
                if (req.body.booking.length > 0) {
                    responseDB = await trans.createEventEquip(eventRow, bookEquipArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.phase = [];
                } else {
                    responseDB = await trans.createEventShort(eventRow);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.booking = [];
                    rb.phase = [];
                }
            }


            try {

                // write to `t_notifications` table
                const [notification] = await Notification.createNew(notifyRow);
                console.log("result notification:", notification);

            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with writing notification to database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            msg = `Мероприятие успешно создано. idEvent = ${req.body.id}`;
            return res.status(responseDB[0].status).json([{ msg: msg }, rb]);

        } catch (error) {
            console.log("error:", error);
            return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
        }
    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.deleteTrans = async (req, res) => {
    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let unixTime = Date.now();
    let responseDB;

    if (status.status === 200) {




        console.log("authentication successfull!");

        try {
            const [delEvent] = await Event.copyRow(req.params.id);
            console.log("delEvent:", delEvent);
            if (delEvent.length > 0) {
                delEvent[0].idUpdatedBy = userId;
                delEvent[0].unixTime = unixTime;
                delEvent[0].is_deleted = 1;

                let delEventRow = Object.values(delEvent[0]);
                delEventRow.shift();
                console.log("delEventRow:", delEventRow);

                let notifyRow = [];

                notifyRow.push(userId);
                notifyRow.push("delete");
                notifyRow.push("event");
                notifyRow.push(req.params.id);
                notifyRow.push(delEvent[0].idWarehouse);
                notifyRow.push(unixTime);

                responseDB = await trans.deleteEvent(req.params.id, delEventRow);

                try {

                    // write to `t_notifications` table
                    const [notification] = await Notification.createNew(notifyRow);
                    console.log("result notification:", notification);

                } catch (error) {
                    console.log("error:", error);
                    res.status(500).json({ msg: "We have problems with writing notification to database" });
                    return {
                        error: true,
                        message: 'Error from database'
                    }
                }


                return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });

            } else {
                return res.status(200).json({ msg: `Мероприятия с id=${req.params.id} не существует` });
            }
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with deleting event data from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }


    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.updateTrans = async (req, res) => {
    console.log("updateTrans req.body:", req.body);
    console.log("updateTrans req.params.id:", req.params.id);

    const rb = Object.assign({}, req.body);
    if (rb.hasOwnProperty('id')) {
        delete rb.id;
    }


    let status = await auth.authenticateJWT(req, res);
    let userId = status.id;
    let unixTime = Date.now();
    let phaseArr;
    let bookEquipArr;
    let bookCalendarArr;
    let responseDB;

    if (status.status === 200) {

        let result = checkEventBodyValid(req.body);
        if (result[0].valid === true) {
            req.body = checkEventPhase(req.body);
            req.body = checkEventBooking(req.body);
        } else return res.status(500).json(result[1].msg);


        console.log("authentication successfull!");

        req.body.id = req.params.id;
        req.body.creator = {};
        req.body.creator.id = userId;
        req.body.unixTime = unixTime;

        if (req.body.phase.length > 0) {

            phaseArr = Phase.destructObj(req.body.phase, req.body.id, userId, unixTime);
            req.body.phase = phaseArr;
            console.log("==============   phase   ==============");
        }

        if (req.body.booking.length > 0) {

            let block = 0;
            if (req.body.block === 1) {
                block = 1;
            }

            bookEquipArr = BookEquipment.destructObj(req.body.booking, req.body.id, req.body.warehouse.id, userId, unixTime, block);
            req.body.booking = bookEquipArr;
            console.log("================   booking   ============");
            let dateStart = new Date(req.body.time.start.slice(0, 10));
            let dateEnd = new Date(req.body.time.end.slice(0, 10));
            // console.log("createDaysArray:", createBookArray(dateStart, dateEnd, req.body));
            if (req.body.phase.length > 0) {
                bookCalendarArr = createBookArray(dateStart, dateEnd, req.body);
                console.log("bookEquipArr:", bookEquipArr);
            }
        }

        let eventRow = Event.destructObj(req.body);

        let notifyRow = [];

        notifyRow.push(userId);
        notifyRow.push("update");
        notifyRow.push("event");
        notifyRow.push(req.body.id);
        notifyRow.push(req.body.warehouse.id);
        notifyRow.push(unixTime);

        try {

            if (req.body.phase.length > 0) {
                if (req.body.booking.length > 0) {
                    responseDB = await trans.updateEventFull(req.body.id, eventRow, phaseArr, bookEquipArr, bookCalendarArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                } else {
                    responseDB = await trans.updateEventPhase(req.body.id, eventRow, phaseArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.booking = [];
                }
            } else {
                if (req.body.booking.length > 0) {
                    responseDB = await trans.updateEventEquip(req.body.id, eventRow, bookEquipArr);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.phase = [];
                } else {
                    responseDB = await trans.updateEventShort(req.body.id, eventRow);
                    // return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
                    rb.booking = [];
                    rb.phase = [];
                }
            }

            try {

                // write to `t_notifications` table
                const [notification] = await Notification.createNew(notifyRow);
                console.log("result notification:", notification);

            } catch (error) {
                console.log("error:", error);
                res.status(500).json({ msg: "We have problems with writing notification to database" });
                return {
                    error: true,
                    message: 'Error from database'
                }
            }

            msg = `Мероприятие успешно обновлено. idEvent = ${req.params.id}`
            return res.status(responseDB[0].status).json([{ msg: msg }, rb, { "id": req.params.id }]);

        } catch (error) {
            console.log("error:", error);
            return res.status(responseDB[0].status).json({ msg: responseDB[1].msg });
        }
    } else {
        res.status(status.status).json({ msg: "We have problems with JWT authentication" });
    }
}

exports.getSummary = async (req, res) => {
    console.log("getSummary");
    let status = await auth.authenticateJWT(req, res);
    console.log("statusCode:", status);

    if (status.status === 200) {
        try {
            const [result] = await Event.getSummary();
            console.log("result:", result);
            return res.status(200).json(result);
            
        } catch (error) {
            console.log("error:", error);
            res.status(500).json({ msg: "We have problems with getting short event data from database" });
            return {
                error: true,
                message: 'Error from database'
            }
        }
    }

}

function createEventId() {
    let d = new Date();
    let utc = d.getTime().toString();
    let id = utc.slice(0, 11);
    return id;
}

function checkEventBodyValid(reqbody) {

    let msg = [{}];
    // check req.body required properties
    // check title
    if (!reqbody.hasOwnProperty('title')) {
        return msg = [{ valid: false }, { msg: "Не указано название мероприятия!" }];
    }
    if (reqbody.title.length === 0) {
        return msg = [{ valid: false }, { msg: "Не указано название мероприятия!" }];
    }
    // check warehouse
    if (!reqbody.hasOwnProperty('warehouse')) {
        return msg = [{ valid: false }, { msg: "Не указан склад мероприятия!" }];
    }
    // check time
    if (!reqbody.hasOwnProperty('time')) {
        return msg = [{ valid: false }, { msg: "Не указано время мероприятия!" }];
    }

    if (reqbody.time.start.toString().length === 0) {
        return msg = [{ valid: false }, { msg: "Не указано время начала мероприятия!" }];
    }

    if (reqbody.time.end.toString().length === 0) {
        return msg = [{ valid: false }, { msg: "Не указано время окончания мероприятия!" }];
    }

    return msg = [{ valid: true }, { msg: "ok" }];
}

function checkEventPhase(reqbody) {
    // check phase
    if (!reqbody.hasOwnProperty('phase')) {
        reqbody.phase = [];
    }
    return reqbody;
}

function checkEventBooking(reqbody) {
    // check booking
    if (!reqbody.hasOwnProperty('booking')) {
        reqbody.booking = [];
    }
    return reqbody;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getPhase(date, phase) {
    let result;

    // console.log("phase:", phase);

    let dateStartPhaseTo1 = new Date(phase[0][2].slice(0, 10)).getTime();
    let dateEndPhaseTo1 = new Date(phase[0][3].slice(0, 10)).getTime();
    let dateStartPhaseTo2 = new Date(phase[1][2].slice(0, 10)).getTime();
    let dateEndPhaseTo2 = new Date(phase[1][3].slice(0, 10)).getTime();
    let dateStartPhaseTo3 = new Date(phase[2][2].slice(0, 10)).getTime();
    let dateEndPhaseTo3 = new Date(phase[2][3].slice(0, 10)).getTime();

    let phTrTo;
    let phInWork;
    let phTrFrom;



    switch (date.getTime() >= dateStartPhaseTo1 && date.getTime() <= dateEndPhaseTo1) {
        case true:
            phTrTo = 1;
            break;
        default: phTrTo = 0;
            break;
    }

    switch (date.getTime() >= dateStartPhaseTo2 && date.getTime() <= dateEndPhaseTo2) {
        case true:
            phInWork = 1;
            break;
        default: phInWork = 0;
            break;
    }

    switch (date.getTime() >= dateStartPhaseTo3 && date.getTime() <= dateEndPhaseTo3) {
        case true:
            phTrFrom = 1;
            break;
        default: phTrFrom = 0;
            break;
    }
    return [phTrTo, phInWork, phTrFrom];
}

function createBookArray(date1, date2, reqBody) {
    console.log("reqBody.phase:", reqBody.phase);
    let time = Math.abs(date2 - date1);
    let daysQtt = Math.ceil(time / (1000 * 60 * 60 * 24)) + 1;
    let bookArr = [];
    let date = date1;
    for (let i = 0; i < daysQtt; i++) {
        for (let j = 0; j < reqBody.booking.length; j++) {
            let row = [];
            date = addDays(date1, i);
            row.push(date.toISOString().slice(0, 10));
            row.push(reqBody.id);
            row.push(reqBody.booking[j][1]);
            row.push(reqBody.booking[j][2]);
            row.push(reqBody.booking[j][3]);
            row.push(reqBody.creator.id);
            let ph = getPhase(date, reqBody.phase);
            row.push(ph[0]);
            row.push(ph[1]);
            row.push(ph[2]);
            row.push(reqBody.status.id);
            row.push(reqBody.unixTime);
            bookArr.push(row);
        }

    }
    return bookArr;

}