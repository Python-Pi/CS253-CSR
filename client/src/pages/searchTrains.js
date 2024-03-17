import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrainSubway } from "react-icons/fa6";
import { ImAirplane } from "react-icons/im";
import Select from "react-select";

import TrainCell from "../components/trainCell";
import NavBarOn from "../components/NavBarOn";
import train_data from "../info/stations2.json";

import "../style/styles.css";
import "../style/TrainSearch.css";

export default function TrainSearch() {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState("");
    const [originCode, setOriginCode] = useState(""); 
    const [destination, setDestination] = useState("");
    const [dateOfTravel, setDateOfTravel] = useState("");
    const [trainList, setTrainList] = useState([]);
    const [info, setMessage] = useState("");
    const [foundTrains, setFoundTrains] = useState(true);
    const [type, setType] = React.useState(1);
    const [train_options, setTrainOptions] = React.useState([]);


    useEffect(() => {
        if (type === 1) {
        document.querySelector("#train").classList.add("visible");
        document.querySelector("#plane").classList.remove("visible");
        } else if (type === 2) {
        document.querySelector("#train").classList.remove("visible");
        document.querySelector("#plane").classList.add("visible");
        } 
    }, [type]);

    useEffect(() => {
        setTrainOptions(
        train_data.data.map((item) => ({
            label: `${item.name} ${item.code}`,
            value: item.code,
        }))
        );
    }, []);
    
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

    return (
        <div className="flex flex-col">
            <NavBarOn />
            <div className="app-container">
                <div className="query-box">
                    <div className="transport-type">
                        <motion.div
                            className="transport-background"
                            id="train"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                                setType(1);
                            }}
                            >
                            <FaTrainSubway className="icons" name="train" />
                        </motion.div>

                        <motion.div
                            className="transport-background"
                            id="plane"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                                setType(2);
                            }}
                            >
                            <ImAirplane className="icons" name="plane" />
                        </motion.div>
                    </div>

                    <div className="details">
                        <div className=" box from-box">
                        <label htmlFor="from">From</label>
                        <Select
                            options={train_options}
                            styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "60px",
                                width: "clamp(100px, 30vw, 200px)",
                                borderRadius: "10px",
                                border: "1px solid #385de1",
                                padding: " 10px",
                                marginTop: "5px",
                                fontSize: "15px",
                            }),
                            }}
                        />
                        </div>
                        <div className="box to-box">
                        <label htmlFor="to">To</label>
                        <Select
                            options={train_options}
                            styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                height: "60px",
                                width: "clamp(100px, 30vw, 200px)",
                                borderRadius: "10px",
                                border: "1px solid #385de1",
                                padding: " 10px",
                                marginTop: "5px",
                                fontSize: "15px",
                            }),
                            }}
                        />
                        </div>
                        <div className=" box date-box">
                        <label htmlFor="date">Departure</label>
                        <input className="pankaj-input" type="date" name="date" />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="submit-button"
                    >
                        search
                    </motion.button>
                    </div>
                </div>
        </div>
    );
}


 {/* <div className="HSTCnav flex flex-row justify-between pt-4 px-4">
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
                </div> */}