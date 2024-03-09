import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TravelCell from "../components/TravelCell";

export default function JoinedTrips(props) {
    const [info, setMessage] = useState([]);
    const [joinedTrips, setJoinedTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);  

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedTrips`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setJoinedTrips(data.trips);
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
                    {!props.showButton && (
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/travel')}>Go Back</button>
                        </div>
                    )}
                </div>
            )
        }
    }
}