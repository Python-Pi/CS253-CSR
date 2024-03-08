import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


export default function RenderAdmin(props) {
    const navigate = useNavigate();
    const info = props.info;
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [joinedUsers, setJoinedUsers] = useState([]);
    const [declinedUsers, setDeclinedUsers] = useState([]);

    useEffect(() => {
        if(info.userStatus === "admin"){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/appliedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => setAppliedUsers(data.users));
        }
    }, [info.userStatus, info.trip_name, info.destination]);

    useEffect(() => {
        if(info.userStatus === "admin"){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => setJoinedUsers(data.users));
        }
    }, [info.userStatus, info.trip_name, info.destination]);

    useEffect(() => {
        if(info.userStatus === "admin"){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/declinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => setDeclinedUsers(data.users));
        }
    }, [info.userStatus, info.trip_name, info.destination]);

    function addUserToTrip(user) {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/addUserToTrip`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip_name: info.trip_name,
                destination: info.destination,
                user_id: user.user_id,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data.error || 'User added to the trip.');
            window.location.reload();
        });
    }

    function declineUserToTrip(user) {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/declineUserToTrip`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip_name: info.trip_name,
                destination: info.destination,
                user_id: user.user_id,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data.error || 'User declined to join the trip.');
            window.location.reload();
        });
    }

    const handleChatServer = () => {
        navigate('/travelChatRoom', {
            state: {
                trip_name: info.trip_name,
                destination: info.destination,
            }
        });
    };
    return (
        <div className="container">
            <h1 className="text-center my-4">Admin</h1>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary mt-3" onClick={handleChatServer}>
                    Join Chat Server
                </button>           
            </div>
            <h2 className="text-center my-4">Applied Users</h2>
            <ul className="list-group">
                {appliedUsers.map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.user_name}
                        <button className="btn btn-primary" onClick={() => addUserToTrip(user)} >Accept</button> 
                        <button className="btn btn-primary" onClick={() => declineUserToTrip(user)} >Decline</button>                        
                    </li>
                ))}
            </ul>

            <h2 className="text-center my-4">Joined Users</h2>
            <ul className="list-group">
                {joinedUsers.map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.user_name}
                        <button className="btn btn-primary" onClick={() => declineUserToTrip(user)} >Decline</button>
                    </li>
                    
                ))}
            </ul>

            <h2 className="text-center my-4">Declined Users</h2>
            <ul className="list-group">
                {declinedUsers.map((user, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {user.user_name}
                        <button className="btn btn-primary" onClick={() => addUserToTrip(user)} >Accept</button> 
                    </li>
                ))}
            </ul>
        </div>
    );
}