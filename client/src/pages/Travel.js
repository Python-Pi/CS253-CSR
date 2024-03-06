import NavBarOn from "../components/NavBarOn";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Travel(){
    const [info, setMessage] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
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
                </div>
            )
        }
    }
}

export default Travel;