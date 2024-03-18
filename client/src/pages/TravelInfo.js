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
                <div>
                    <div className="flex justify-start pl-8 sticky">
                        <button className="btn btn-dark btn-lg" onClick={() => navigate('/travel')}>Go Back</button>
                    </div>
                    <h1 className='text-center text-5xl font-semibold'>{trip_name}</h1>
                    <h2 className='text-center text-4xl font-semibold'>Destination : {destination}</h2>

                    <div className="HStrip-list flex flex-row justify-between block border-2 border-slate-600 shadow-md shadow-slate-600 rounded-xl ml-6 p-4">
                        <div className="HStrip pl-6">
                            <h2 className='text-4xl font-semibold pb-4'>{selectTrip.trip_name}</h2>
                            <p className='text-xl font-medium'>Destination: {selectTrip.destination}</p>
                            <p className='text-xl font-medium'>Start Date: {moment(selectTrip.start_date).format('DD-MM-YYYY')}</p>
                            <p className='text-xl font-medium'>End Date: {moment(selectTrip.end_date).format('DD-MM-YYYY')}</p>
                            <p className='text-xl font-medium'>Amount: {selectTrip.amount}</p>
                            <p className='text-xl font-medium'>Details: {selectTrip.details}</p>
                            <p className='text-xl font-medium'>Created By: {selectTrip.user_name}</p>
                        </div>
                        <img className='current-display-image' id='current-travel-image' src={imgUrl} alt='current-display'></img>
                    </div>

                    <RenderStatus userStatus={userStatus} trip_name={trip_name} destination={destination}/>
                </div>
            </div>
        );
    }
}