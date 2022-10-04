"use strict";

const express = require("express");
const app = express();
const cors = require("cors");

const rootRouter = require("./routes/rootRouter");
const authRouter = require("./routes/authRouter");
const equipRouter = require("./routes/equipRouter");
const userRouter = require("./routes/userRouter");
const eventRouter = require("./routes/eventRouter");
const calendarRouter = require("./routes/bookCalendarRouter");
const locationRouter = require("./routes/locationRouter");


const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', rootRouter);
app.use('/login', authRouter);
app.use('/equip', equipRouter);
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/booking', calendarRouter);
app.use('/locations', locationRouter);


//          S E R V E R
// --------------------------------------------------------------------
app.listen(PORT, err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("listening on port", PORT);
});