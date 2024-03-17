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
                <div className="absolute top-0 right-0 pt-[0.3em] pr-10">
                    <button className="HSbtn mt-3" onClick={handleChatServer}>
                        Join Chat Server
                    </button>      
                </div>
                <h2 className="text-center my-4 text-4xl font-semibold pt-10">Joined Users</h2>
                <ul className="list-group flex flex-col pb-10">
                    {otherUsers.map((user, index) => (
                        <li key={index} className="block border-1 p-2 px-4 rounded-md border-slate-600 py-2 flex flex-row justify-between my-2 mx-5">
                            <div className='text-2xl'>
                                {user.user_name}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )

    } else if (info.userStatus === "applied"){
        return (
            <div>
                <h1 className="text-center pb-1">Applied</h1>
                <h3 className="text-center py-1"> Application Pending...</h3>
                <p className="text-center py-1"> Please contact the Journey Initiator if it's taking too long!</p>
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
                <div className="flex absolute top-0 right-0 pt-[1.3em] pr-10">
                        <button className="HSbtn" onClick={applyToJoin}>Apply to Join</button>
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