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
        <div key={info.index} className="trip block border-2 border-slate-600 shadow-md shadow-slate-600 pt-10">
            <h2 className='text-4xl font-semibold pb-4'>{info.trip_name}</h2>
            <p className='text-xl'>Destination: {info.destination}</p>
            <p className='text-xl'>Start Date: {moment(info.start_date).format('DD-MM-YYYY')}</p>
            <p className='text-xl'>End Date: {moment(info.end_date).format('DD-MM-YYYY')}</p>
            <p className='text-xl'>Amount: {info.amount}</p>
            {info.user_name && <p className='text-xl'>Journey Initiator: {info.user_name}</p>}
            {info.user_name && <button className="btn btn-dark btn-lg" onClick={handleJoinTrip}>Join Trip</button>}
            {!info.user_name && <button className="btn btn-dark btn-lg" onClick={handleJoinTrip}>Trip Details</button>}
         </div>
    );
}

