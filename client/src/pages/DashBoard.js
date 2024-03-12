import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBarOn from "../components/NavBarOn";
import TravelCell from "../components/TravelCell";
import TrainCell from "../components/trainCell";


function DashBoard(){
    const navigate = useNavigate();
    const [info, setMessage] = useState("");
    const [hostedTrips, setHostedTrips] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);

    const [bookedTrains, setBookedTrains] = useState([]);
    const [notBookedTrains, setNotBookedTrains] = useState([]);
    const hanldeClick = () => {
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


    let trainsData;
    const fetchUserTrains = async () => {
        // setBookedTrains([]);
        // setNotBookedTrains([]);
        let temp1=[];
        let temp2=[];
        console.log("fetching user trains");
        try {
            const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/getUserTrains`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            trainsData = await response.json();
            console.log(trainsData);
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
    useEffect(() => {
        fetchUserTrains();
    }, []);

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
                        <button type="button" className="btn btn-secondary btn-lg" onClick={hanldeClick}>Itinerary</button>
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

                    <h2>Upcoming train journeys</h2>
                    <h4>Booked</h4>
                    {bookedTrains}
                    <h4>Not Booked</h4>
                    {notBookedTrains}

                </div>
            )
        }
    }
}

export default DashBoard;