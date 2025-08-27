const express = require("express");
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../models/user");

const router = express.Router();

router.get("/signup", (req, res) =>{
    res.render("signup", { errors: [], user: req.user, page: 'auth' });
    });

router.post(
    "/signup",
    [
        body("firstName").trim().isLength({ min: 1 }).withMessage("First name required."),
        body("lastName").trim().isLength({ min: 1 }).withMessage("Last name required."),
        body("username").isEmail().withMessage("Valid email required."),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("confirmPassword").custom((value, { req }) =>{
            if(value !== req.body.password) throw new Error("Passwords do not match");
            return true;
            }),
        ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render("signup", { errors: errors.array(), user: req.user, page: 'auth' });
        } try {
            const hashed = await bcrypt.hash(req.body.password, 10);
            await createUser(req.body.firstName, req.body.lastName, req.body.username, hashed);
            res.redirect("/auth/login");
        }catch (err){
            console.error(err);
            res.render("error", { message: "Signup failed", user: req.user, page: 'auth' });
            }
        }
    );

router.get("/login", (req, res) => {
    res.render("login", { user:req.user, page: 'auth' });
});

router.post(
    "/login",
    passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    })
);

router.get("/logout", (req, res, next) =>{
    req.logout(err =>{
    if (err) return next(err);
    res.redirect("/");
    });
});

module.exports = router;