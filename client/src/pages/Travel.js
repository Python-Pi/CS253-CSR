import NavBarOn from "../components/NavBarOn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';


function Travel(){
    const [info, setMessage] = useState([]);
    const [trips, setTrips] = useState([]);
    const [hostedTrips, setHostedTrips] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);  

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/trips`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setTrips(data.trips);
        });
    }, []);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/hostedTrips`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setHostedTrips(data.trips);
        });
    }, []);
    
    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            navigate('/home');
            return null;
        } else {
            return(
                <div className="travel-page">
                    <NavBarOn />
                    <h1 className="text-center">Hi, Travel Page</h1>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary mt-3" onClick={() => navigate('/addTrip')}>Create a new trip</button>
                    </div>
                    <h1 className="text-center">Hosted Trips</h1>
                    <div className="trip-list hosted-trips">
                       {hostedTrips.map((trip, index) => (
                            <div key={index} className="trip">
                                <h2>{trip.trip_name}</h2>
                                <p>Destination: {trip.destination}</p>
                                <p>Start Date: {moment(trip.start_date).format('DD-MM-YYYY')}</p>
                                <p>End Date: {moment(trip.end_date).format('DD-MM-YYYY')}</p>
                                <p>Amount: {trip.amount}</p>
                            </div>
                        ))}
                    </div>

                    <h1 className="text-center">All trips</h1>
                    <div className="trip-list">
                        {trips.map((trip, index) => (
                            <div key={index} className="trip">
                                <h2>{trip.trip_name}</h2>
                                <p>Destination: {trip.destination}</p>
                                <p>Start Date: {moment(trip.start_date).format('DD-MM-YYYY')}</p>
                                <p>End Date: {moment(trip.end_date).format('DD-MM-YYYY')}</p>
                                <p>Amount: {trip.amount}</p>
                                <p>Journey Initiator: {trip.user_name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }
}

export default Travel;