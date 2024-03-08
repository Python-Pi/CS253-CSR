import NavBarOn from "../components/NavBarOn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TravelCell from "../components/TravelCell";


function Travel(){
    const [info, setMessage] = useState([]);
    const [trips, setTrips] = useState([]);
    const [search, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        // You can also make a request to your server here if you're implementing search on the server side
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/searchTrip?search=${search}`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setTrips(data.trips);
        });
    };

    const handleSearchClick = () => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/searchTrip?search=${search}`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setTrips(data.trips);
        });
    };

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);  

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/trips`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data)=> {
            setTrips(data.trips);
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
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-primary mt-3" onClick={() => navigate('/hostedTrips')}>Hosted Trips</button>
                    </div>

                    <h1 className="text-center">All trips</h1>

                    <div className="search-bar d-flex justify-content-center">
                        <input type="text" placeholder="Search trips" onChange={handleSearch}/>
                        <button className="btn btn-primary" onClick={handleSearchClick}>Search</button>
                    </div>

                    <div className="trip-list">
                    {trips.map((trip, index) => (
                         <TravelCell 
                            key={index} 
                            trip_name={trip.trip_name} 
                            destination={trip.destination} 
                            start_date={trip.start_date} 
                            end_date={trip.end_date} 
                            amount={trip.amount} 
                            user_name={trip.user_name} 
                        />
                    ))}
                    </div>
                </div>
            )
        }
    }
}

export default Travel;