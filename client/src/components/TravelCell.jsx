import moment from 'moment';
import { useNavigate } from "react-router-dom";


export default function TravelCell(info) {
        const navigate = useNavigate();
        const handleJoinTrip = () => {
            navigate('/travelInfo', {
                state: {
                    trip_name: info.trip_name,
                    destination: info.destination,
                }
            });
        };
return (
        <div key={info.index} className="trip">
            <h2>{info.trip_name}</h2>
            <p>Destination: {info.destination}</p>
            <p>Start Date: {moment(info.start_date).format('DD-MM-YYYY')}</p>
            <p>End Date: {moment(info.end_date).format('DD-MM-YYYY')}</p>
            <p>Amount: {info.amount}</p>
            {info.user_name && <p>Journey Initiator: {info.user_name}</p>}
            {info.user_name && <button className="btn btn-primary mt-3" onClick={handleJoinTrip}>Join Trip</button>}
            {!info.user_name && <button className="btn btn-primary mt-3" onClick={handleJoinTrip}>Trip Details</button>}
         </div>
    );
}