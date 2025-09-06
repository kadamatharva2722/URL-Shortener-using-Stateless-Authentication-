const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const { connectMongoDB } = require('./connections');
const URL = require("./models/url");
const path = require("path");
//Routes
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/static');
const userRoute = require('./routes/user');
const moveRoute = require('./routes/move');
const { restrictToLoginUseronly, checkAuth } = require('./middleware/auth');
//Port
const port = 8000;

connectMongoDB('mongodb://127.0.0.1:27017/urlShortner')
    .then(() => { console.log("MongoDB connected") });

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use('/url', restrictToLoginUseronly, urlRoute);
app.use('/', checkAuth, staticRoute);
app.use('/user', userRoute);
app.use('/move', moveRoute)

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortID: shortId,
    }, {
        $push: {
            visitHistory: { timestamp: Date.now() },
        },
    });

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL);
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});