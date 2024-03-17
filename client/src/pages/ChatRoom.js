import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function ChatRoom() {
    const navigate = useNavigate();
    const socket = useRef(null);
    const location = useLocation();

    let train_number, date;
    try{
         ({ train_number, date } = location.state);
    } catch{
        navigate('/home');
    }
    
    const [info, setInfo] = useState({});
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('Anonymous'); 
    
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.current = io(`ws://${process.env.REACT_APP_IP}:8080`); 
        socket.current.on('message', (message) => {
            console.log(message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.current.disconnect();
        };
    }, []);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && message !== '') {
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/train/addChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    train_number: train_number,
                    date: date,
                    message: message
                })
            })
            .then((res) => res.json())
            .then((data) => {
                // Handle the response here
            });
            socket.current.emit('message', {
                username: username,
                message: train_number + date +message,
            });
            setMessage('');
        }
    };

    const handleButtonSend = () =>{
        if(message !== ''){
            fetch(`http://${process.env.REACT_APP_IP}:8000/api/train/addChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    train_number: train_number,
                    date: date,
                    message: message
                })
            })
            .then((res) => res.json())
            .then((data) => {
                // Handle the response here
            });
            socket.current.emit('message', {
                username: username,
                message: train_number + date +message,
            });
            setMessage('');
        }
    }

    const handleBackPage = () => {
        navigate('/dashboard/itinerary/train');
    };

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setInfo(data));
    }, []);  

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/user/name`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setUsername(data.name));
    }, []);

    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/train/chats?train_number=${encodeURIComponent(train_number)}&date=${encodeURIComponent(date)}`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status){
                setMessages(data.chats);
            }
        });
    }, [train_number, date]);

    if(!info.loggedIn){
        navigate('/dashboard');
        return null;
    } else {
        return (
            <div>
                <h1 className='text-center'>Hi! {username}, Let's Chat</h1>
                <h2 className='text-center'>Train Number : {train_number}</h2>
                <h2 className='text-center'>Date of departure : {date}</h2>
                <ul>
                    {messages.map((message, index) => {
                        if (message.message.startsWith(train_number + date)) {
                            const newMessage = message.message.substring((train_number + date).length);
                            return (
                                <li key={index} className="user-message">
                                    <span className="user">{message.username}:</span>
                                    <span className="message">{newMessage}</span>
                                </li>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="message" />
                <button className="btn btn-primary mt-3" onClick={handleButtonSend}>Send</button>

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mt-3" onClick={handleBackPage}>Go Back</button>
                </div>
            </div>
        );
    }
}