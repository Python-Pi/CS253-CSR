import moment from 'moment';


export default function TravelCell(props) {
    return (
        <div key={props.index} className="trip">
            <h2>{props.trip_name}</h2>
            <p>Destination: {props.destination}</p>
            <p>Start Date: {moment(props.start_date).format('DD-MM-YYYY')}</p>
            <p>End Date: {moment(props.end_date).format('DD-MM-YYYY')}</p>
            <p>Amount: {props.amount}</p>
            {props.user_name && <p>Journey Initiator: {props.user_name}</p>}
        </div>
    );
}