const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
const helmet = require("helmet");
const { findUserByUsername } = require("./models/user");
require("dotenv").config();

const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
            store: new pgSession({ pool }),
                    secret: process.env.SECRET_SESSION,
                            resave: false,
                                    saveUninitialized: false,
                                        })
                                        );

                                        app.use(passport.initialize());
                                        app.use(passport.session());

                                        passport.use(
                                            new localStrategy(async (username, password, done) =>{
                                                    try{
                                                                const user = await findUserByUsername(username);
                                                                            if(!user) return done(null, false, { message: "No such user" });

                                                                                        const match = await bcrypt.compare(password, user.password);
                                                                                                    if(!match) return done(null, false, { message: "Wrong password" });

                                                                                                                return done(null, user);
                                                                                                                        }catch (err){
                                                                                                                                    return done(err);
                                                                                                                                            }
                                                                                                                                                })
                                                                                                                                                );

                                                                                                                                                passport.serializeUser((user, done) => done(null, user.id));
                                                                                                                                                passport.deserializeUser(async (id, done) => {
                                                                                                                                                    const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
                                                                                                                                                        done(null, result.rows[0]);
                                                                                                                                                        });

                                                                                                                                                        const indexRouter = require("./routes/index");
                                                                                                                                                        const authRouter = require("./routes/auth");
                                                                                                                                                        const messageRouter = require("./routes/messages");

                                                                                                                                                        app.use("/", indexRouter);
                                                                                                                                                        app.use("/auth", authRouter);
                                                                                                                                                        app.use("/messages", messageRouter);

                                                                                                                                                        app.listen(3000, () => console.log("Server running on http://localhost:3000"))