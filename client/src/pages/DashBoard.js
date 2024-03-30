import React from "react";
import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import TrackVisibility from 'react-on-screen';

import NavBarOn from "../components/NavBarOn";
import TravelCell from "../components/TravelCell";
import TrainCell from "../components/trainCell";
import Footer from "../components/Footer";
import logo from "../Assets/logo-no-background copy.png";
import "../style/styles.css";
import "../style/Dashboard.css";
import "../style/NavBar.css";

function DashBoard(){
    const navigate = useNavigate();
    const [info, setMessage] = useState("");
    const [hostedTrips, setHostedTrips] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);

    const [bookedTrains, setBookedTrains] = useState([]);
    const [notBookedTrains, setNotBookedTrains] = useState([]);

    const handleclick = () => {
        navigate('/dashboard/itinerary/train');
    }

    const handleTravelClick = () => {
        navigate('/travel');
    }

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));

        if(info.loggedIn === false){
            navigate('/home');
        }

        if(!info.loggedIn){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/hostedTrips`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data)=> {
                setHostedTrips(data.trips);
            });
        }

        if(!info.loggedIn){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedTrips`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data)=> {
                setJoinedTrips(data.trips);
            });
        }
    }, [info.loggedIn, navigate]);    

    // useEffect(()=>{
    //     if(info.loggedIn === false){
    //         navigate('/home');
    //     }
    // }, [info.loggedIn, navigate])

    // useEffect(() => {
    //     if(!info.loggedIn){
    //         fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/hostedTrips`, {
    //             credentials: 'include'
    //         })
    //         .then((res) => res.json())
    //         .then((data)=> {
    //             setHostedTrips(data.trips);
    //         });
    //     }
    // }, [info.loggedIn]);

    // useEffect(() => {
    //     if(!info.loggedIn){
    //         fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedTrips`, {
    //             credentials: 'include'
    //         })
    //         .then((res) => res.json())
    //         .then((data)=> {
    //             setJoinedTrips(data.trips);
    //         });
    //     }
    // }, [info.loggedIn]);


    useEffect(() => {
        const fetchUserTrains = async () => {
            let temp1=[];
            let temp2=[];
            let trainsData = null;
            try {
                const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/getUserTrains`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: 'include',
                })
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                trainsData = await response.json();
                if(trainsData.success){
                    const bookedList= trainsData.data.booked;
                    const notBookedList= trainsData.data.notBooked;
                    for(let i=0; i<bookedList.length; i++){
                        try {
                            const result= await fetch(`http://${process.env.REACT_APP_IP}:8000/getTrainByNumberAndDate`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    number: bookedList[i].train_number,
                                    date: bookedList[i].date,
                                })
                            });
                            const data= await result.json();
                            console.log(data);
                            if(data.success){
                                const train={
                                    train_base:{
                                        train_no: bookedList[i].train_number,
                                        source_stn_code: bookedList[i].from_station,
                                        dstn_stn_code: bookedList[i].to_station,
                                        notBooked: data.data.yet_to_book,
                                        confirmed: data.data.booked,
                                        train_name: data.data.train_name,
                                    }
                                }
                                console.log(train);
                                temp1.push(<TrainCell key={i} train={train} origin={bookedList[i].from_station} destination={bookedList[i].to_station} date={bookedList[i].date}/>);
                            }
                        }
                        catch (error) {
                            console.log("error while creating booked train list");   
                        }
                    }
                    setBookedTrains(temp1);
                    for(let i=0; i<notBookedList.length; i++){
                        try {
                            const result= await fetch(`http://${process.env.REACT_APP_IP}:8000/getTrainByNumberAndDate`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    number: notBookedList[i].train_number,
                                    date: notBookedList[i].date,
                                })
                            });
                            const data= await result.json();
                            console.log(data);
                            if(data.success){
                                const train={
                                    train_base:{
                                        train_no: notBookedList[i].train_number,
                                        source_stn_code: notBookedList[i].from_station,
                                        dstn_stn_code: notBookedList[i].to_station,
                                        notBooked: data.data.yet_to_book,
                                        confirmed: data.data.booked,
                                        train_name: data.data.train_name,
                                    }
                                }
                                temp2.push(<TrainCell key={i+bookedList.length} train={train} origin={notBookedList[i].from_station} destination={notBookedList[i].to_station} date={notBookedList[i].date}/>);
                            }
                        }
                        catch (error) {
                            console.log("error while creating not booked train list");   
                        }
                    }
                    setNotBookedTrains(temp2);
                }
            } catch (error) {
                console.log("Error occurred while fetching user trains data", error);
            }
        };
         fetchUserTrains();
    }, []);

    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [, setIndex] = useState(1);
    const toRotate = [ "Adventure", "Explore", "Discover", ];
    const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text, delta, ])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

    if (info === null) {
        return <div>Loading...</div>;
    }

    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            navigate('/home');
            return null;
        } else {
            return(
                 <div className="DashBoard-page">
                    <NavBarOn />
                    <div className="routemate-intro">
                        <section className="banner" id="home">
                            <Container>
                            <Row className="aligh-items-center">
                                <Col xs={12} md={6} xl={7}>
                                <TrackVisibility>
                                    {({ isVisible }) =>
                                    <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                                    <h1>{`Hi ${info.name}!, RouteMate welcomes you to `} {text}</h1>
                                    <p>
                                        Welcome to Route Mate, your ultimate travel companion! Whether you're embarking on a solo adventure or seeking company for your journey, Route Mate connects you with like-minded travelers every step of the way. With our innovative platform, you can discover fellow explorers heading to the same destinations, engage in lively chat rooms to exchange tips and stories, explore insightful travel blogs, and create unforgettable memories together. Say goodbye to solo travel blues and hello to new friendships and exciting adventures. Join Route Mate today and let the journey begin!
                                    </p>
                                    </div>}
                                </TrackVisibility>
                                </Col>
                                <Col xs={12} md={6} xl={5}>
                                    <img src={logo} id ='HSlogo' alt="routemate-logo"></img>
                                </Col>
                            </Row>
                            </Container>
                        </section>
                    </div>


                    <div className="travel-intro">
                        <section className="project" id="projects">
                            <Container>
                                <Row>
                                    <Col size={12}>
                                        <TrackVisibility>
                                                <div >
                                                    <h2>Travel</h2>
                                                    <p>
                                                        Welcome to our Trips! Explore a world of possibilities and embark on unforgettable journeys with Route Mate. Whether you're planning a weekend getaway, a cross-country road trip, or a backpacking adventure through exotic landscapes, we've got you covered. Discover curated trip itineraries, insider tips from fellow travelers, and hidden gems off the beaten path. From bustling cities to serene natural wonders, let Route Mate inspire your next adventure and make every trip an unforgettable experience.
                                                    </p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <button className="btn btn-light btn-lg" onClick={handleTravelClick}>Travel</button>
                                                </div>

                                        </TrackVisibility>
                                    </Col>

                                    <Col size={12}>
                                        <TrackVisibility>
                                                <div >
                                                    <h2>Itinerary</h2>
                                                    <p>
                                                        Ever wondered how many fellow travelers are sharing the same train journey as you? With Route Mate's train booking connections, you're not just booking a seat; you're joining a community of adventurers. Our platform allows you to see how many people are traveling on a particular train, giving you the opportunity to connect with like-minded explorers, share experiences, and make new friends along the way. Whether you're embarking on a solo adventure or seeking company for your journey, Route Mate keeps you connected every step of the way. Discover the camaraderie of train travel like never before. Book your train journey with Route Mate today!
                                                    </p>
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <button className="btn btn-light btn-lg" onClick={handleclick}>Itinerary</button>
                                                </div>
                                        </TrackVisibility>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </div>

                    <div className="hosted-trips mt-10 mb-5 mx-2">
                        <h1 className="text-center font-semibold">Hosted Trips</h1>
                        <div className="trip-list">
                        {hostedTrips.map((trip, index) => (
                            <TravelCell 
                                key={index} 
                                trip_name={trip.trip_name} 
                                destination={trip.destination} 
                                start_date={trip.start_date} 
                                end_date={trip.end_date} 
                                amount={trip.amount} 
                            />
                        ))}
                        </div>
                    </div>

                    <div className="hosted-trips mx-2">
                        <h1 className="text-center font-semibold">Joined Trips</h1>
                        <div className="trip-list">
                        {joinedTrips.map((trip, index) => (
                            <TravelCell 
                                key={index} 
                                trip_name={trip.trip_name} 
                                destination={trip.destination} 
                                start_date={trip.start_date} 
                                end_date={trip.end_date} 
                                amount={trip.amount} 
                                
                            />
                        ))}
                        </div>
                    </div>

                    <h2 className="font-semibold text-4xl pt-10">Upcoming train journeys</h2>
                    <h4 className="font-semibold pl-2 pt-20">Booked:</h4>
                    <div className="flex flex-row justify-center">
                    </div>
                    {bookedTrains}
                    <h4 className="font-semibold pl-2 pt-20">Not Booked:</h4>
                    <div className="flex flex-row justify-center">
                    </div>
                    {notBookedTrains}

                    <Footer />
                </div>
            );
        }
    }
}

export default DashBoard;
