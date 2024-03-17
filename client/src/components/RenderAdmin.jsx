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
            <div className="flex absolute top-0 right-0 pr-10 pt-[0.38em]">
                <button className="HSbtn mt-3" onClick={handleChatServer}>
                    Join Chat Server
                </button>           
            </div>
            <h2 className="text-center my-4 text-4xl font-semibold">Applied Users</h2>
            <ul className="list-group flex flex-col">
                {appliedUsers.map((user, index) => (
                    <li key={index} className="block border-1 p-2 px-4 rounded-md border-slate-600 py-2 flex flex-row justify-between my-2">
                        <div className='text-2xl'>
                            {user.user_name}
                        </div>
                        <div>
                            <button className="HSbtn" onClick={() => addUserToTrip(user)} >Accept</button> 
                        </div>
                        <div>
                            <button className="HSbtn" onClick={() => declineUserToTrip(user)} >Decline</button>
                        </div>                      
                    </li>
                ))}
            </ul>

            <h2 className="text-center my-4 text-4xl font-semibold pt-10">Joined Users</h2>
            <ul className="list-group flex flex-col">
                {joinedUsers.map((user, index) => (
                    <li key={index} className="block border-1 p-2 px-4 rounded-md border-slate-600 py-2 flex flex-row justify-between my-2">
                        <div className='text-2xl pt-1'>
                            {user.user_name}
                        </div>
                        <div>
                            <button className="HSbtn" onClick={() => declineUserToTrip(user)} >Decline</button>
                        </div>
                    </li>
                    
                ))}
            </ul>

            <h2 className="text-center my-4 text-4xl font-semibold pt-10">Declined Users</h2>
            <ul className="list-group flex flex-col pb-10">
                {declinedUsers.map((user, index) => (
                    <li key={index} className="block border-1 p-2 px-4 rounded-md border-slate-600 py-2 flex flex-row justify-between my-2">
                        <div className='text-2xl pt-1'>
                            {user.user_name}
                        </div>
                        <div>
                            <button className="HSbtn" onClick={() => addUserToTrip(user)} >Accept</button> 
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}