const express = require("express");
const { createMessage, deleteMessage } = require("../models/message");

const router = express.Router();

router.get("/new", (req, res) =>{
    if(!req.user) return res.redirect("/auth/login");
    res.render("new-message", { user: req.user, page: 'message', errors: [] });
});

router.post("/new", async (req, res) =>{
    if(!req.user) return res.redirect("/auth/login");
    await createMessage(req.body.title, req.body.text, req.user.id);
    res.redirect("/");
});

router.post("/:id/delete", async (req, res) =>{
    if(!req.user || !req.user.is_admin) return res.redirect("/");
    await deleteMessage(req.params.id);
    res.redirect("/")
});

module.exports = router;