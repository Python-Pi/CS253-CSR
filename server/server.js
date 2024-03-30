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
import { createServer } from "http";
import { Server } from "socket.io";
import rail from "indian-rail-api"
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";


// Setting up a websocket server
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" },
})

// Basic Initialising for Express app, defining port, setting salt rounds for BCrypt and setting environmental variables
const app = express();
const port = 8000;
const saltRounds = 10;
env.config();

// Variables and functions
const addr = `http://${process.env.IP}:${process.env.PORT}`;

// Initializing express session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));

// // Initializing passport js
app.use(passport.initialize());
app.use(passport.session())
app.use(express.json());
app.use(cors({
    origin: [`http://localhost:${process.env.PORT}`, `http://${process.env.IP}:${process.env.PORT}`, `https://d69c-14-139-38-199.ngrok-free.app`], 
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
    connectionTimeoutMillis: 0
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
  console.log(req.isAuthenticated());
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
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
  
    try {
      const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
  
      if (checkResult.rows.length > 0) {
        // alert("User already exists with that email");
        res.json({
          success: false,
          err: false
        })
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
            res.json({
              success: false,
              err: true
            })
          } else {
            const result = await db.query(
              'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
              [name, email, hash]
            );
            const user = result.rows[0];
            req.login(user, (err) => {
              console.log("User Created");
              res.json({
                success: true,
                err: false
              })
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

// Getting user name 
app.get('/api/user/name', (req, res)=>{
  if(req.isAuthenticated()){
    res.json({
        status: true,
        loggedIn: true,
        name: req.user.name,
    })
  }else{
    res.json({
        status: true,
        loggedIn: false,
    })
  }
});

// POST request for handing adding new trip from the client
app.post('/api/travel/addTrip', upload.single('image'), async (req, res)=>{
  if(req.isAuthenticated()){

    const imageUrl = '/uploads/' + req.file.filename;
    const { tripName, destination, startDate, endDate, amount, details } = req.body;

     try {
         await db.query('INSERT INTO trips (user_id, user_name, trip_name, destination, start_date, end_date, amount, details, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [req.user.id, req.user.name, tripName, destination, startDate, endDate, amount, details, imageUrl]);
         await db.query('INSERT INTO user_statuses (user_id, trip_name, destination, status, user_name) VALUES ($1, $2, $3, 1, $4)', [req.user.id, tripName, destination, req.user.name]);

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
  } else{
    res.json({
      status: true,
      loggedIn: false,
    });
  }
});

// Adding a new api for accessing all the trips available from the database
app.get('/api/travel/trips', async (req, res) => {
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

// Adding API to just access the trips which are joined by the user (status == 2)
app.get('/api/travel/joinedTrips', async (req, res) => {
  if(req.isAuthenticated()){
    try {
      const result = await db.query(`
        SELECT trips.* 
        FROM trips 
        JOIN user_statuses 
        ON trips.trip_name = user_statuses.trip_name 
        AND trips.destination = user_statuses.destination 
        WHERE user_statuses.status = 2
        AND user_statuses.user_id = $1
      `, [req.user.id]);
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
  } else{
    res.json({
      status: true,
      loggedIn: false,
    });
  }
});

// Adding api to just accessing trips which are hosted by a particular user
app.get('/api/travel/hostedTrips', async (req, res) => {
  if(req.isAuthenticated()){
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
  } else {
    res.json({
      status: true,
      loggedIn: false,
    });
  }

});


// Adding api to just access a specific trip
app.get('/api/travel/specificTrip', async(req, res)=>{
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

// API for search for Travel
app.get('/api/travel/searchTrip', async(req, res)=>{

  const term = req.query.search.toLowerCase();
  const searchTerm = `%${term}%`;
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


// API for retriving the user status w.r.t a trip

app.get('/api/travel/userStatus', async(req, res)=>{
  if(req.isAuthenticated()){
  const { trip_name, destination } = req.query;
  const user_id = req.user.id;

  try {
    const result = await db.query('SELECT * FROM user_statuses WHERE trip_name = $1 AND destination = $2 AND user_id = $3', [trip_name, destination, user_id]);
    const userStatus = result.rows[0]?.status; // Extract status from the first row
    let statusString = 'new'; // Default status
    if (userStatus === 1) {
      statusString = 'admin';
    } else if (userStatus === 2) {
      statusString = 'joined';
    } else if (userStatus === 3) {
      statusString = 'applied';
    } else if (userStatus === 4) {
      statusString = 'declined';
    }
    res.json({
      status: true,
      loggedIn: true,
      userStatus: statusString,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving user statuses from the database',
    });
  }
} else {
  res.json({
    status: true,
    loggedIn: false,
  });
}
});


// API for applying to join a trip
app.post('/api/travel/applyToJoin', async(req, res)=>{
  if(req.isAuthenticated()){
  const { trip_name, destination } = req.body;
  const user_id = req.user.id;
  const user_name = req.user.name;
  try {
    const result = await db.query('SELECT * FROM user_statuses WHERE user_id = $1 AND trip_name = $2 AND destination = $3', [user_id, trip_name, destination]);
    if (result.rows.length > 0) {
      res.json({
        status: false,
        error: 'You have already applied to join this trip.',
      });
    } else {
      await db.query('INSERT INTO user_statuses (user_id, trip_name, destination, status, user_name) VALUES ($1, $2, $3, 3, $4)', [user_id, trip_name, destination, user_name]);
      res.json({
        status: true,
        loggedIn: true,
      });
    }
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while applying to join the trip',
    });
  }
} else {
  res.json({
    status: true,
    loggedIn: false,
  });
}
});

// API for getting all the users who have applied to join a trip
app.get('/api/travel/appliedUsers', async(req, res)=>{
  const { trip_name, destination } = req.query;
  try {
    const result = await db.query('SELECT * FROM user_statuses WHERE trip_name = $1 AND destination = $2 AND status = 3', [trip_name, destination]);
    const users = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving applied users from the database',
    });
  }
});

// API for adding a user to a trip
app.post('/api/travel/addUserToTrip', async(req, res)=>{
  const { trip_name, destination, user_id } = req.body;
  try {
    await db.query('UPDATE user_statuses SET status = 2 WHERE trip_name = $1 AND destination = $2 AND user_id = $3', [trip_name, destination, user_id]);
    res.json({
      status: true,
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while adding the user to the trip',
    });
  }
});

// API for decling a user to a trip
app.post('/api/travel/declineUserToTrip', async(req, res)=>{
  const { trip_name, destination, user_id } = req.body;
  try {
    await db.query('UPDATE user_statuses SET status = 4 WHERE trip_name = $1 AND destination = $2 AND user_id = $3', [trip_name, destination, user_id]);
      res.json({
      status: true,
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while declining the user to the trip',
    });
  }
});

// API for getting all the users who have joined a trip
app.get('/api/travel/joinedUsers', async(req, res)=>{
  const { trip_name, destination } = req.query;
  try {
    const result = await db.query('SELECT * FROM user_statuses WHERE trip_name = $1 AND destination = $2 AND status = 2', [trip_name, destination]);
    const users = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving joined users from the database',
    });
  }
});

// API for getting declined users
app.get('/api/travel/declinedUsers', async(req, res)=>{
  const { trip_name, destination } = req.query;
  try {
    const result = await db.query('SELECT * FROM user_statuses WHERE trip_name = $1 AND destination = $2 AND status = 4', [trip_name, destination]);
    const users = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving declined users from the database',
    });
  }
});

// Adding chat to the database
app.post('/api/travel/addChat', async(req, res)=>{
  const { trip_name, destination, message } = req.body;
  const msg_add = trip_name + destination + message;
  try {
    await db.query('INSERT INTO travelchat (username, message) VALUES ($1, $2)', [req.user.name, msg_add]);
    res.json({
      status: true,
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while adding the chat to the database',
    });
  }
});

// API for getting chats for a trip
app.get('/api/travel/chats', async(req, res)=>{
  const { trip_name, destination } = req.query;
  const msg_start = trip_name + destination + '%';
  try {
    const result = await db.query('SELECT * FROM travelchat WHERE message LIKE $1', [msg_start]);
    const chats = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      chats: chats,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving chats from the database',
    });
  }
});

// API for logging out user 
app.post('/api/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


// <------------------------- Pawan Code starts here -------------------->

const generateOTP=()=>{
  return otpGenerator.generate(6,{digits:true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
}

const sendEmailOTP= async (email,OTP)=>{
  try{
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: `${process.env.EMAIL_ID}`,
        pass: `${process.env.EMAIL_PASSWORD}`, // Use the app-specific password generated in your Gmail account settings
      },
    });

    const mailOptions={
      from:'siriussnape880@gmail.com',
      to:email,
      subject:'OTP for signing up',
      text:`Your OTP for registering to RouteMate is ${OTP}`
    }

    const result=await transporter.sendMail(mailOptions)
    const query= await db.query(
      'INSERT INTO OTP (EMAIL, OTP) VALUES($1,$2) RETURNING ID',[email,OTP]
    )
    return {
      id:query.rows[0].id,
      sentOTP:true
    }
  }catch(error)
  {
    console.error('Error while sending OTP ', error)
    return {
      sentOTP:false
    }
  }
}


app.post('/sendOTP', async (req, res) => {
  const { email } = req.body;
  const OTP = generateOTP();
  const result = await sendEmailOTP(email, OTP);
  if (result.sentOTP) {
    res.json({
      status: true,
      success: true,
      message: 'OTP sent successfully',
    });
  } else {
    res.json({
      status: true,
      success: false,
      message: 'Error while sending OTP',
    });
  }
})

app.post('/verifyOTP', async (req, res) => {
  const { email, OTP } = req.body;
  const result = await db.query('SELECT * FROM OTP WHERE EMAIL = $1 AND OTP = $2', [email, OTP]);
  if (result.rows.length > 0) {
    res.json({
      status: true,
      success: true,
      message: 'OTP verified successfully',
    });
  } else {
    res.json({
      status: true,
      success: false,
      message: 'OTP verification failed',
    });
  }
  await db.query('DELETE FROM OTP WHERE EMAIL = $1', [email]);
})


// searching for all trains between stations
app.post('/api/getTrainsBetweenStations',async (req,res)=>{
  const {origin, destination, dateOfTravel}=req.body;
  //authentication check
  if (req.isAuthenticated()) {
    let json = '';
    try {
        json = await new Promise((resolve, reject) => {
            rail.getTrainBtwStation(origin, destination, (r) => {
                resolve(JSON.parse(r));
            });
        });
    } catch (error) {
        console.log("Error while fetching data :");
        res.json({
          success: false,
          status: true
        })
    }
    if(!json.success)
    {
      res.json({
        success: false,
        status: true,
        loggedIn: true,
      })
      return;
    }
    //filtering trains based on dateOfTravel
    const filteredData = (json.data).filter(train => {
      const runningDays = train.train_base.running_days; // e.g., "0100000"
      let dayOfWeek = new Date(dateOfTravel).getDay(); // 0 for Sunday, 1 for Monday, ...
      dayOfWeek=((dayOfWeek+6)%7); // 0 for monday, 6 for sunday
      return runningDays.charAt(dayOfWeek) === '1';
  });
    // const date=new Date(dateOfTravel);
    // adding the notBooked, confirmed
    let newData=await Promise.all((filteredData).map(async (train)=>{
      try{
        const result=await db.query("SELECT * FROM TRAINS WHERE NUMBER = $1 AND DATE = $2",[train.train_base.train_no, dateOfTravel]);
        if(result.rows.length==0)
        {
          return {
            train_base:{
              ...train.train_base,
              notBooked : 0,
              confirmed : 0,
            }
          }
        }
        else
        {
          return {
            train_base:{
              ...train.train_base,
              notBooked: result.rows[0].yet_to_book,
              confirmed: result.rows[0].booked,
            }
          }
        }
      }
      catch(err)
      {
        console.error("Error while retriving from database : ", err);  
        return {
          error : true,
        };
      }
    }))
    res.json({
      status: true,
      success: true,
      loggedIn: true,
      data: newData,
    })
  } else {
      res.json({
          status: true,
          success: false,
          loggedIn: false,
      })
  }
}
)

// for adding user into trains under not_booked
app.post('/addNotBookedTrainUser',async (req,res)=>{
  if(req.isAuthenticated())
  {
    const {train, date, origin, destination}= req.body;
    // const dateOfTravel=new Date(date)
    // check if the train is present in database
    const result= await db.query("SELECT * FROM TRAINS WHERE NUMBER=$1 AND DATE=$2", [train.train_base.train_no, date]);
    if(result.rows.length==0)
    {
      await db.query("INSERT INTO TRAINS VALUES($1, $2, $3, $4, $5)",[train.train_base.train_no, 0, 0, date, train.train_base.train_name]);
    }

    const result1 = await db.query("SELECT * FROM NOT_BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER = $1 AND USER_ID = $2 AND DATE = $3",[train.train_base.train_no, req.user.id, date]);
    // checking if user is already in the table
    if(result1.rows.length>0)
    {
      res.json({
        status:true,
        success:false,
        loggedIn:true,
        message:"user is already in this train",
      })
    }

    else
    {
      const result2 = await db.query("SELECT * FROM BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER = $1 AND USER_ID = $2 AND DATE = $3",[train.train_base.train_no, req.user.id, date]);
      // checking if the user is already in booked_train_users
      if(result2.rows.length>0)
      {
        await db.query("DELETE FROM BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER= $1 AND USER_ID= $2 AND DATE= $3",[train.train_base.train_no, req.user.id, date]);
      }
      await db.query("INSERT INTO NOT_BOOKED_TRAIN_USERS VALUES($1, $2, $3, $4, $5)",[train.train_base.train_no, req.user.id, date, origin, destination]);
      const notBooked= await db.query("SELECT YET_TO_BOOK FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      const confirmed= await db.query("SELECT BOOKED FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      res.json({
        status: true,
        success: true,
        loggedIn: true,
        notBooked: notBooked.rows[0].yet_to_book,
        confirmed: confirmed.rows[0].booked,
      })
    }
  }
  else
  {
    res.json({
      status:true,
      success:false,
      loggedIn:false,
      message: "user not logged in",
    })
  }
})


// for adding user into trains under booked
app.post('/addBookedTrainUser',async (req,res)=>{
  if(req.isAuthenticated())
  {
    const {train, date, origin, destination}= req.body;
    // const dateOfTravel= new Date(date);
    // check if the train is present in database
    const result= await db.query("SELECT * FROM TRAINS WHERE NUMBER=$1 AND DATE=$2", [train.train_base.train_no, date]);
    if(result.rows.length==0)
    {
      await db.query("INSERT INTO TRAINS VALUES($1, $2, $3, $4, $5)",[train.train_base.train_no, 0, 0, date, train.train_base.train_name]);
    }

    const result1 = await db.query("SELECT * FROM BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER = $1 AND USER_ID = $2 AND DATE=$3",[train.train_base.train_no, req.user.id, date]);
    // checking if user is already in the table
    if(result1.rows.length>0)
    {
      res.json({
        status:true,
        success:false,
        loggedIn:true,
        message:"user is already in this train",
      })
    }

    else
    {
      const result2 = await db.query("SELECT * FROM NOT_BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER = $1 AND USER_ID = $2 AND DATE=$3",[train.train_base.train_no, req.user.id, date]);
      // checking if the user is already in not_booked_train_users
      if(result2.rows.length>0)
      {
        await db.query("DELETE FROM NOT_BOOKED_TRAIN_USERS WHERE TRAIN_NUMBER= $1 AND USER_ID= $2 AND DATE=$3",[train.train_base.train_no, req.user.id, date]);
      }
      await db.query("INSERT INTO BOOKED_TRAIN_USERS VALUES($1, $2, $3, $4, $5)",[train.train_base.train_no, req.user.id, date, origin, destination]);
      const notBooked= await db.query("SELECT YET_TO_BOOK FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      const confirmed= await db.query("SELECT BOOKED FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      res.json({
        status: true,
        success: true,
        loggedIn: true,
        notBooked: notBooked.rows[0].yet_to_book,
        confirmed: confirmed.rows[0].booked,
      })
    }
  }
  else
  {
    res.json({
      status:true,
      success:false,
      loggedIn:false,
      message: "user not logged in",
    })
  }
})

// get train by number and date
app.post('/getTrainByNumberAndDate',async (req,res)=>{
  const {number, date}=req.body;
  const result= await db.query("SELECT * FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[number, date]);
  if(result.rows.length==0)
  {
    res.json({
      status:1,
      success:0,
      loggedIn:1,
    })
  }
  else
  {
    res.json({
      status:1,
      success:1,
      loggedIn:1,
      data: result.rows[0],
    })
  }

})

// for fetching user trains
app.post('/getUserTrains',async (req,res)=>{
  if(req.isAuthenticated())
  {
    try {
      const userId=req.user.id;
      const notBookedTrainsData= await db.query("SELECT * FROM NOT_BOOKED_TRAIN_USERS WHERE USER_ID=$1", [userId]);
      const bookedTrainsData= await db.query("SELECT * FROM BOOKED_TRAIN_USERS WHERE USER_ID=$1", [userId]);
      const trainsData = {
        notBooked : notBookedTrainsData.rows,
        booked : bookedTrainsData.rows,
      }
      res.json({
        data : trainsData,
        status:1,
        success:1,
        loggedIn:1,
      });
    } catch (error) {
      console.log("Error while fetching user trains data : ");
      res.json({
        status:1,
        success:0,
        loggedIn:1,
      })
    }
  }
  else
  {
    res.json({
      status:1,
      loggedIn:0,
      success:0,
    })
  }
})

// for removing user from train
app.post('/removeUserFromTrain', async (req,res)=>{
  if(req.isAuthenticated)
  {
    try {
      const {train, date} = req.body;
      const userId= req.user.id;
      // const dateOfTravel= new Date(date);
      await db.query("DELETE FROM NOT_BOOKED_TRAIN_USERS WHERE USER_ID=$1 AND TRAIN_NUMBER=$2 AND DATE=$3",[userId, train.train_base.train_no, date]);
      await db.query("DELETE FROM BOOKED_TRAIN_USERS WHERE USER_ID=$1 AND TRAIN_NUMBER=$2 AND DATE=$3",[userId, train.train_base.train_no, date]);
      console.log("User "+userId+" removed successfully from "+train.train_base.train_no+" on "+date);
      const notBooked= await db.query("SELECT YET_TO_BOOK FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      const confirmed= await db.query("SELECT BOOKED FROM TRAINS WHERE NUMBER=$1 AND DATE=$2",[train.train_base.train_no, date]);
      res.json({
        status: 1,
        success: 1,
        loggedIn: 1,
        notBooked: notBooked.rows[0].yet_to_book,
        confirmed: confirmed.rows[0].booked,
      })
    } catch (error) {
      console.log("Some error occured while removing user from train "+ error);
    }
  }
  else
  {
    res.json({
      status:1,
      success: 0,
      loggedIn: 0,
    })
  }
})


// for checking if the user can access the chat room
app.post('/train_chat', async (req, res) => {
  if (req.isAuthenticated()) {
    const { train, date } = req.body;
    const result1 =await db.query("SELECT * FROM NOT_BOOKED_TRAIN_USERS WHERE USER_ID =$1 AND TRAIN_NUMBER=$2 AND DATE=$3", [req.user.id, train.train_base.train_no, date]);
    const result2 =await db.query("SELECT * FROM BOOKED_TRAIN_USERS WHERE USER_ID =$1 AND TRAIN_NUMBER=$2 AND DATE=$3", [req.user.id, train.train_base.train_no, date]);
    if(result1.rows.length>0 || result2.rows.length>0)
    {
      res.json({
        status: true,
        success: true,
        loggedIn: true,
      })
    }
    else
    {
      res.json({
        status: true,
        success: false,
        loggedIn: true,
      })
    }
  } else {
    res.json({
      status: true,
      success: false,
      loggedIn: false,
    })
  }
})


// setting up chat room

// Adding chat to the database
app.post('/api/train/addChat', async(req, res)=>{
  const { train_number, date, message } = req.body;
  const msg_add = train_number + date + message;
  try {
    await db.query('INSERT INTO TRAINCHAT (username, message) VALUES ($1, $2)', [req.user.name, msg_add]);
    res.json({
      status: true,
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while adding the chat to the database',
    });
  }
});

// API for getting chats for a trip
app.get('/api/train/chats', async(req, res)=>{
  const { train_number, date } = req.query;
  const msg_start = train_number + date + '%';
  try {
    const result = await db.query('SELECT * FROM TRAINCHAT WHERE message LIKE $1', [msg_start]);
    const chats = result.rows;
    res.json({
      status: true,
      loggedIn: true,
      chats: chats,
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      error: 'There was an error while retrieving chats from the database',
    });
  }
});

app.get('/getAllBlogs', async (req, res) => {
  if(req.isAuthenticated)
  {
    try {
      const result = await db.query('SELECT * FROM blogs');
      const blogs = result.rows;
      res.json({
        status: true,
        success: true,
        loggedIn: true,
        blogs: blogs,
      });
    } catch (err) {
      console.error("Error while fetching blogs from database : ",err);
      res.json({
        status: true,
        success: false,
        loggedIn: true,
        error: 'There was an error while retrieving blogs from the database',
      });
    }
  }
  else
  {
    res.json({
      status: true,
      success: false,
      loggedIn: false,
      error: 'User not logged in',
    });
  }
});

app.post('/postBlog', async (req,res)=>{
  if(req.isAuthenticated)
  {
    try {
      const { content, title}=req.body;
      await db.query('INSERT INTO blogs (title, content, user_name) VALUES ($1, $2, $3)', [title, content, req.user.name]);
      res.json({
        status: true,
        success: true,
        loggedIn: true,
      });
    } catch (error) {
      console.log("Error while posting blog : ", error);
      res.json({
        status: true,
        success: false,
        loggedIn: true,
        error: 'There was an error while posting the blog',
      });
    }
  }
  else
  {
    res.json({
      status: true,
      success: false,
      loggedIn: false,
      error: 'User not logged in',
    });
  }
})

// <------------------------- Pawan Code ends here -------------------->

// Setting up Chat Servers
io.on('connection', (socket) => {
  socket.on('message', (message) =>     {
      console.log(message);
      io.emit('message', message );   
  });
});


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
          // res.redirect(addr + '/notfound');

          return cb(null, false);

          // return cb("User not found");
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

httpServer.listen(8080, ()=> console.log(`Web socket server running`));