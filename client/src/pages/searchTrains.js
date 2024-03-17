import React, { useState, useEffect } from "react";
import TrainCell from "../components/trainCell";
import { useNavigate } from "react-router-dom";
import "../style/styles.css";

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
            <div className="flex flex-col">
            <div className="HSTCnav flex flex-row justify-between pt-4 px-4">
                <button onClick={handleClick} className="HSbtn">DashBoard</button>
                <form onSubmit={handleSubmit} className="flex flex-row">
                    <div className="px-2">
                        <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value) }placeholder="Origin" className="block border-2 p-2 rounded-lg border-[#0000ff]"/>
                    </div>
                    <div className="px-2">
                        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="block border-2 p-2 rounded-lg border-[#0000ff]"/>
                    </div>
                    <div className="px-2">
                        <input type="date" value={dateOfTravel} onChange={(e) => setDateOfTravel(e.target.value)} placeholder="Date" className="pr-2 mr-2 block border-2 p-2 rounded-lg border-[#0000ff]"/>
                    </div>
                    <div className="px-2">
                        <button type="submit" className="HSbtn pl-4">Search</button>
                    </div>
                </form>
            </div>
            <div className="HSTCbody flex flex-col pt-10 ">
                {!foundTrains && <div>No trains found</div>}
                {trainList}
            </div>
            </div>
        );
    }
    
}


