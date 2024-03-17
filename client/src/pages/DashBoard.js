import React from "react";
import { useState, useEffect, useRef} from "react";
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
    }, []);    

    useEffect(()=>{
        if(info.loggedIn === false){
            navigate('/home');
        }
    }, [info.loggedIn])

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


    let trainsData = useRef(null);
    useEffect(() => {
        const fetchUserTrains = async () => {
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
         fetchUserTrains();
    }, []);

    const handleBlog = () => {
        navigate('/blogs');
    }

    return(
        <div className="DashBoard-page">
            <NavBarOn />
            <h1 className="pt-32">Hi {info.name}, Welcome to Dashboard Page</h1>
            <div className="text-center mt-4">
                <button type="button" className="HSbtn mr-2" onClick={handleTravelClick}>Travel</button>
                <button type="button" className="HSbtn" onClick={handleclick}>Itinerary</button>
            </div>

            <div className="d-flex justify-content-center">
                <button type="button" className="HSbtn" onClick={handleBlog}>Blog</button>
            </div>
            
            <div className="hosted-trips mt-10 mb-5 mx-2">
                <h1 className="text-center font-semibold">Hosted Trips</h1>

                {info.loggedIn && 
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
                </div>}
            </div>

            <div className="hosted-trips mx-2">
                <h1 className="text-center font-semibold">Joined Trips</h1>

                {info.loggedIn &&
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
                }
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

        </div>
    )
}

export default DashBoard;