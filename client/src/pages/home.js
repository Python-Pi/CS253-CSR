import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBarOff";

function Home(){    
    const navigate = useNavigate();
    const [info, setInfo] = useState("");
    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/`,{
            credentials: 'include'
        })
          .then((res) => res.json())
          .then((data) => setInfo(data));
    }, []);
    
     if (info === null) {
        return <div>Loading...</div>;
    }

    if (!info.status) {
        navigate('/notfound');
        return null; 
    }

    return (
        <div className="home-page">
            <NavBar />
            <h1>Hi, Home Page</h1>
            <h1>{info.message}</h1>
        </div>
    );
}

export default Home;