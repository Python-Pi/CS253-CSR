import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import RenderAdmin from './RenderAdmin';

export default function RenderStatus(info) {
    const navigate = useNavigate();
    const [otherUsers, setOtherUsers] = useState([]);
    useEffect(() => {
        if(info.userStatus === "joined"){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/joinedUsers?trip_name=${encodeURIComponent(info.trip_name)}&destination=${encodeURIComponent(info.destination)}`, {
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((data) => setOtherUsers(data.users));
        }
    }, [info.userStatus, info.trip_name, info.destination]);

    if(info.userStatus === "admin"){
       return <RenderAdmin info={info} />
    } else if (info.userStatus === "joined"){
        const handleChatServer = () => {
            navigate('/travelChatRoom', {
                state: {
                    trip_name: info.trip_name,
                    destination: info.destination,
                }
            });
        };
        return (
            <div>
                <h1 className="text-center">Joined</h1>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mt-3" onClick={handleChatServer}>
                        Join Chat Server
                    </button>      
                </div>
                <h2 className="text-center my-4">Joined Users</h2>
                <ul className="list-group">
                    {otherUsers.map((user, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {user.user_name}
                        </li>
                    ))}
                </ul>
            </div>
        )

    } else if (info.userStatus === "applied"){
        return (
            <div>
                <h1 className="text-center">Applied</h1>
                <h3 className="text-center"> Application Pending</h3>
                <p className="text-center"> Please contact the Journey Initiator if it's taking too long.</p>
            </div>
        )

    } else if(info.userStatus === "new"){
        function applyToJoin() {
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/applyToJoin`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trip_name: info.trip_name,
                    destination: info.destination,
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                alert(data.error || 'Applied to join the trip.');
                window.location.reload();
            });
        }
        return (
            <div>
                <h1 className="text-center">New</h1>
                <div className="d-flex justify-content-center">
                        <button className="btn btn-primary mt-3" onClick={applyToJoin}>Apply to Join</button>
                </div>
            </div>
        )
    } else if(info.userStatus === "declined"){
        return (
            <div>
                 <h1 className="text-center">Declined</h1>
                <h3 className="text-center"> Journey Initiator Declined Your Request</h3>
                <p className="text-center"> Please contact the Journey Initiator.</p>
            </div>
        )
    }
}