import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TravelCell from "../components/TravelCell";


export default function HostedTrips(props){
    const [info, setMessage] = useState([]);
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
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/hostedTrips`, {
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
                <div className="hosted-trips">
                    <h1 className="text-center text-5xl font-semibold">Hosted Trips</h1>
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

                    {!props.showButton && (
                        <div className="d-flex justify-content-center">
                            <button className="HSbtn mt-3" onClick={() => navigate('/travel')}>Go Back</button>
                        </div>
                    )}
                </div>
            )
        }
    }
}