const shortID = require("shortid");
const URL = require('../models/url');
const shortid = require("shortid");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url)
        return res.status(400).json({ Error: "Url not provided" });

    const shortId = shortid();
    await URL.create({

        shortID: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    const allurl = await URL.find({});
    return res.render('home', {
        id: shortId,
        urls: allurl
    });
}
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortID: shortId });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}
