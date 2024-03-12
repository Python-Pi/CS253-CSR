import React, { useState, useEffect } from "react";
import TrainCell from "../components/trainCell";
import { useNavigate } from "react-router-dom";

export default function TrainSearch() {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [dateOfTravel, setDateOfTravel] = useState("");
    const [trainList, setTrainList] = useState([]);
    const [info, setMessage] = useState("");
    const [foundTrains, setFoundTrains] = useState(true);

    const handleClick = () => {
        navigate('/dashboard');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            origin,
            destination,
            dateOfTravel
        };
        console.log(formData);

        try {
            const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/api/getTrainsBetweenStations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            setTrainList([]);
            if(!data.status){
                alert("We are facing issues at the server. Please try again later.");
                navigate('/dashboard');
            }
            if(!data.success || origin == null || destination == null || dateOfTravel == null){
                setFoundTrains(false);
                setTrainList([]);
            }
            else
            {
                setFoundTrains(true);
                setTrainList(data.data.map((train, index) => <TrainCell key={index} train={train} date={dateOfTravel} origin={origin} destination={destination} />
                ));
            }
        } catch (error) {
            console.log("Error while fetching data from api/getTrainsBetweenStations");
        }
    };
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);    

    if (info === null) {
        return <div>Loading...</div>;
    }
    else if(!info.status || !info.loggedIn){
        navigate('/home');
    }
    else
    {
        return (
            <div>
                <button onClick={handleClick}>DashBoard</button>
                <form onSubmit={handleSubmit}>
                    <label>
                        Origin:
                        <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Destination:
                        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Date of Travel:
                        <input type="date" value={dateOfTravel} onChange={(e) => setDateOfTravel(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Search</button>
                </form>
                {!foundTrains && <div>No trains found</div>}
                {trainList}
            </div>
        );
    }
    
}


