const express = require('express');
const { user } = require('../models/user');
const URL = require('../models/url');
const { v4: uuidv4 } = require('uuid');
const { setUser, getUser } = require('../service/auth');

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await user.create({
        name: name,
        email: email,
        password: password,
    });

    const allurl = await URL.find({});
    return res.redirect('/');
}

async function handleUserLogin(req, res) {
    const { name, email, password } = req.body;

    const foundUser = await user.findOne({ email: email });

    if (!foundUser)
        return res.render('login', {
            error: "Invalid Username or Password"
        });


    const token=setUser(foundUser);
    res.cookie("uid", token);
    return res.redirect('/')

}

module.exports = {
    handleUserSignup,
    handleUserLogin
}
