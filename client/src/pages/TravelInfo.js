import moment from 'moment';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation} from 'react-router-dom';
import RenderStatus from '../components/RenderStatus';

export default function TravelInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const { trip_name, destination } = location.state;
    const [selectTrip, setSelectTrip] = useState([]);
    const [info, setInfo] = useState("");
    const [userStatus, setUserStatus] = useState("");

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`,{
            credentials: 'include'
        })
          .then((res) => res.json())
          .then((data) => setInfo(data));
    }, []);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/specificTrip?trip_name=${encodeURIComponent(trip_name)}&destination=${encodeURIComponent(destination)}`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setSelectTrip(data.trips[0]));
    }, [trip_name, destination]);

    useEffect(() => {
        if (info.loggedIn) {
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/userStatus?trip_name=${encodeURIComponent(trip_name)}&destination=${encodeURIComponent(destination)}`,{
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => setUserStatus(data.userStatus));
        }
    }, [trip_name, destination, info.loggedIn]); // Add info.loggedIn to the dependency array

    
    if(!info.loggedIn){
        navigate('/home');
        return null;
    } else {
        const imgUrl = `http://${process.env.REACT_APP_IP}:8000${selectTrip.image_url}`;
        return (
            <div className="travel-info">
                <h1 className='text-center'>{trip_name}</h1>
                <h2 className='text-center'>Destination : {destination}</h2>
    
                <div className="d-flex justify-content-center current-display-image-container ">
                    <img className='current-display-image' src={imgUrl} alt='current-display'></img>
                </div>

                <div className="trip-list">
                    <div  className="trip">
                        <h2>{selectTrip.trip_name}</h2>
                        <p>Destination: {selectTrip.destination}</p>
                        <p>Start Date: {moment(selectTrip.start_date).format('DD-MM-YYYY')}</p>
                        <p>End Date: {moment(selectTrip.end_date).format('DD-MM-YYYY')}</p>
                        <p>Amount: {selectTrip.amount}</p>
                        <p>Details: {selectTrip.details}</p>
                        <p>Created By: {selectTrip.user_name}</p>
                    </div>
                </div>

                <RenderStatus userStatus={userStatus} trip_name={trip_name} destination={destination}/>

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/travel')}>Go Back</button>
                </div>
            </div>
        );
    }
}