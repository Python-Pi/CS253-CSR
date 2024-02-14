import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import {Strategy} from "passport-local";
import env from "dotenv";
import cors from "cors";

// Basic Initialising for Express app, defining port, setting salt rounds for BCrypt and setting environmental variables
const app = express();
const port = 8000;
const saltRounds = 10;
env.config();

// Variables and functions
const addr = `http://${process.env.IP}:3000`;

// Enabline trust proxy
app.enable('trust proxy')

// Initializing express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));

// // Initializing passport js
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', `http://${process.env.IP}:3000`], 
    credentials: true 
}));

// Using a middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Initializing and connecting to postgres database
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// GET request for '/' which checks if the user is authenticated and redirect to /dashboard and /home respectively
app.get('/', (req, res)=>{
    res.json({
      status: true,
  })
});

// GET API request for to check whether the user is authenticated or not
app.get('/api/login', (req, res)=>{
  if (req.isAuthenticated()) {
    res.json({
        status: true,
        loggedIn: true,
    })
} else {
    res.json({
        status: true,
        loggedIn: false,
    })
}
})

// POST request for '/register' page which adds the user into the datase and redirects to '/chat' page.
// Unauthorized users are sent back to /home page
app.post("/register", async (req, res) => {
  console.log(req.body);
    const email = req.body.username;
    const password = req.body.password;
  
    try {
      const checkResult = await db.query('SELECT * FROM users WHERE USERNAME = $1', [
        email,
      ]);
  
      if (checkResult.rows.length > 0) {
        res.redirect(addr + '/home');
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            res.redirect(addr + '/home');
          } else {
            const result = await db.query(
              'INSERT INTO users (USERNAME, password) VALUES ($1, $2)',
              [email, hash]
            );
            const user = result.rows[0];
            req.login(user, (err) => {
              console.log("User Created");
              res.redirect(addr + '/login');
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
});

// POST request for checking if the user login status and sending the user to the required webpage
app.post("/login", passport.authenticate("local", {
    successRedirect: `http://${process.env.IP}:3000/dashboard`,
    failureRedirect: `http://${process.env.IP}:3000/login`,
}));

// Setting up Passport Js
passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
        const result = await db.query('SELECT * FROM users WHERE USERNAME = $1', [
          username,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                return cb(null, user);
              } else {
                console.log(valid);
                return cb(null, false);
              }
            }
          });
        } else {
          return cb("User not found");
        }
      } catch (err) {
        console.log(err);
      }
    })
);

// Serializing passport js ( don't know what this is doing )
passport.serializeUser(function(user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.listen(port , `${process.env.IP}`, ()=>{
    console.log(`Server is succesfully running in port ${port}`);
})

