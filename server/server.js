import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import {Strategy} from "passport-local";
import env from "dotenv";
import cors from "cors";
import multer from "multer";

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
app.use('/uploads', express.static('uploads'));

// Initializing and connecting to postgres database
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// Store upload files to directory upload
const upload = multer({ dest: 'uploads/' }); 

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
        name: req.user.name
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
    const name = req.body.name;
  
    try {
      const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
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
              'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
              [name, email, hash]
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
    successRedirect: addr + '/dashboard',
    failureRedirect: addr + '/login',
}));

// POST request for handing adding new trip from the client
app.post('/api/addTrip', upload.single('image'), async (req, res)=>{
    console.log(req.body);
    console.log(req.file); 
    const imageUrl = '/uploads/' + req.file.filename;
    const { tripName, destination, startDate, endDate, amount, details } = req.body;

     try {
         await db.query('INSERT INTO trips (user_id, user_name, trip_name, destination, start_date, end_date, amount, details, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [req.user.id, req.user.name, tripName, destination, startDate, endDate, amount, details, imageUrl]);
 
         res.json({
             status: true,
             loggedIn: false,
         });
     } catch (err) {
         console.error(err);
         res.json({
             status: false,
             error: 'There was an error while adding the trip to the database',
         });
     }
});

// Adding a new api for accessing all the trips available from the database
app.get('/api/trips', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trips LIMIT 20');
    const trips = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      trips: trips,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving trips from the database',
    });
  }
});

// Adding api to just accessing trips which are hosted by a particular user
app.get('/api/hostedTrips', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM trips where user_id = $1', [req.user.id]);
    const trips = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      trips: trips,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving trips from the database',
    });
  }
});

// Adding api to just access a specific trip
app.get('/api/specificTrip', async(req, res)=>{
  const { trip_name, destination } = req.query; // Accessing paramaters
  try {
    const result = await db.query('SELECT * FROM trips where trip_name = $1 AND destination = $2', [trip_name, destination]);
    const trips = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      trips: trips,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving trips from the database',
    });
  }
})

// Search for Travel
app.get('/api/searchTrip', async(req, res)=>{
  console.log(req.query);
  const searchTerm = `%${req.query.search}%`;
  try {
    const result = await db.query('SELECT * FROM trips WHERE LOWER(trip_name)  like $1 OR LOWER(destination)  like $2', [searchTerm, searchTerm]);
    const trips = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      trips: trips,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving trips from the database',
    });
  }
})

// Setting up Passport Js
passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [
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

