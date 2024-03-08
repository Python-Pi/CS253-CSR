import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function TravelChatRoom(props) {
    const navigate = useNavigate();
    const socket = useRef(null);
    const location = useLocation();

    const { trip_name, destination } = location.state;
    const [info, setInfo] = useState({});
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(''); // replace with actual username
    
    useEffect(() => {
        setUsername('Ei');
    }, []); // The empty array means this effect runs once when the component mounts

    setUsername('Ei');
    const [messages, setMessages] = useState([
        { username: 'Admin', message: 'Cross Site Scripting Not Allowed!' },
        { username: 'Admin', message: 'This website has very weak security' },
        { username: 'Admin', message: 'So, DON\'T try to break it.' },
    ]);

    useEffect(() => {
        socket.current = io(`ws://${process.env.REACT_APP_IP}:8080`); // replace with actual WebSocket server URL
        socket.current.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && message !== '') {
            socket.current.emit('message', {
                username: username,
                message: message,
            });
            setMessage('');
        }
    };

    const handleBackPage = () => {
        navigate('/travelInfo', {
            state: {
                trip_name: trip_name,
                destination: destination,
            }
        });
    };

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setInfo(data));
    }, []);  

    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            navigate('/home');
            return null;
        } else {
            return (
                <div>
                    <h1>Hi! {username}, Let's Chat</h1>
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index} className="user-message">
                                <span className="user">{message.username}:</span>
                                <span className="message">{message.message}</span>
                            </li>
                        ))}
                    </ul>
                    <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="message" />
                    <button onClick={handleBackPage}>Go Back</button>
                </div>
            );
        }
    }
}