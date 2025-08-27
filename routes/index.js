const express = require("express");
const { getAllMessages } = require("../models/message");

const router = express.Router();

router.get("/", async (req, res) =>{
    const messages = await getAllMessages();
    res.render("index", { user: req.user, messages, page: 'message' });
});

router.get("/join", (req, res) =>{
    res.render("join", { user: req.user, error: null, page: 'join' });
});

router.post("/join", (req, res) =>{
    if(req.body.code === process.env.SECRET_PASSCODE){
    const pool = require("../db");
    pool.query("UPDATE users SET is_member=true WHERE id=$1", [req.user.id]);
    return res.redirect("/");
}
if(req.body.code === process.env.SECRET_ADMIN){
    const pool = require("../db");
    pool.query("UPDATE users SET is_admin=true WHERE id=$1", [req.user.id]);
    return res.redirect("/");
}
    res.render("join", { user: req.user, error: "Wrong passcode!", page: 'join' });
});

module.exports = router;