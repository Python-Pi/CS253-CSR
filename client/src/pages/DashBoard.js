import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarOn from "../components/NavBarOn";
import TravelCell from "../components/TravelCell";

function DashBoard(){
    const navigate = useNavigate();
    const [info, setMessage] = useState("");
    const [hostedTrips, setHostedTrips] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);

    const handleTravelClick = () => {
        navigate('/travel');
    }

    const handleIterClick = () =>{
        navigate('/iter');
    }

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);    

    useEffect(() => {
        if(!info.loggedIn){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/hostedTrips`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data)=> {
                setHostedTrips(data.trips);
            });
        }
    }, [info.loggedIn]);

    useEffect(() => {
        if(!info.loggedIn){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedTrips`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data)=> {
                setJoinedTrips(data.trips);
            });
        }
    }, [info.loggedIn]);

    if (info === null) {
        return <div>Loading...</div>;
    }

    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            return(
                <div className="DashBoard-page">
                    <NavBarOn />
                    <h1>Hi, Dashboard Page</h1>
                    <h2>Not Logged In</h2>
                </div>
            )
        } else {


            return(
                <div className="DashBoard-page">
                    <NavBarOn />
                    <h1>Hi {info.name}, Welcome to Dashboard Page</h1>
                    <h2>Logged In</h2>
                    <div className="text-center mt-4">
                        <button type="button" className="btn btn-primary btn-lg mr-2" onClick={handleTravelClick}>Travel</button>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={handleIterClick}>Itinerary</button>
                    </div>

                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-primary btn-lg">Blog</button>
                    </div>

                    <h2 className="text-center">Travel Details</h2>
                    

                    <div className="hosted-trips">
                        <h1 className="text-center">Hosted Trips</h1>
                        <div className="trip-list hosted-trips">
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

                    <div className="hosted-trips">
                        <h1 className="text-center">Joined Trips</h1>
                        <div className="trip-list hosted-trips">
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

                </div>
            )
        }
    }
}

export default DashBoard;