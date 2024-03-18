import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import dp4 from '../Assets/dp4.png'

export default function ChatRoom() {
    const navigate = useNavigate();
    const socket = useRef(null);
    const location = useLocation();

    const { train_number, date } = location.state;
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
                <div className='bg-white h-[50em] box-border font-serif'>
                    <div className='flex justify-center items-center wpbg min-h-[100%]'>
                        <div className='relative w-[87.25em] max-w-[100%] h-[calc(100vh-2.53em)] bg-white sshdw overflow-x-auto'>
                <div className='relative flex w-full h-[3.75em]
      bg-[#ededed]'>
        <div className='w-[5em]'>
         <img src={dp4} className='ssrch h-[3.2em] w-[3.8em] pl-[0.93em] pt-[0.5em]' alt='profile pic'/>
        </div>
        <div className='w-[18em] font-sans'>
        <div className='h-[1.5em] pt-1 text-xl'>Train number {train_number}</div>
        <div className='h-[1.25em] pt-[0.04em] text-sm'>10 members, {date}</div>
        </div>
      </div>
      <div className='relative w-full h-[calc(100%-7.5em)] pt-[1.25em] overflow-x-hidden overflow-y-auto'>
                <ul>
                
                    {messages.map((message, index) => {
                        if (message.message.startsWith(train_number + date)) {
                            const newMessage = message.message.substring((train_number + date).length);
                            if(username === message.username) return (<>
                               <li key={index} className="">
                                <div className='relative w-full pl-[66.5em] ml-1 mt-[0.3em] mb-[0.3em]'>
                                <div className='flex -mb-2'>
                                <div className='rounded-[50%] w-2 h-2 mt-2 mr-2 bg-[rgb(101,209,119)]'></div>
                                <p className='mb-[-0.13em] mr-2'>{message.username}</p>
                                <p className='mb-[-0.93em] text-gray-500'>12:15</p>
                                </div>
                                    <span class="top-bot"></span>
                                    <span class="top-bot top-bot-border"></span>
                                    <p  className='justify relative right-0 mb-[0.93em] text-justify w-[17em] p-[0.75em] bg-[rgb(101,209,119)] rounded-lg overflow-hidden break-words h-fit'>{newMessage}</p>
                                    </div>
                                </li>
                               </>                                    
                            );
                            else return (<>
                                 <li key={index} className="">
                                 <div className='relative w-full mt-[0.3em] -ml-3 mb-[0.3em]'>
                                <div className='flex -mb-2'>
                                <div className='rounded-[50%] w-2 h-2 mt-2 mr-2 bg-[#5dbff6]'></div>
                                <p className='mb-[-0.13em] mr-2'>{message.username}</p>
                                <p className='mb-[-0.93em] text-gray-500'>12:15</p>
                                </div>
                                    <span class="top-bot1"></span>
                                    <span class="top-bot1 top-bot-border"></span>
                                    <p  className='flex justify relative right-0 mb-[0.93em] text-justify w-[17em] p-[0.75em] bg-[#5dbff6] rounded-lg break-words'>{newMessage}</p>
                                    </div> 
                                </li>
                               </>
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
      </div>
             <div className='relative w-full h-[3.75em] sinp justify-between flex p-[0.3em] bg-[#f0f0f0] items-center'>
            <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyPress} className='relative w-[90%]  rounded-[1.8em] text-[1em] pl-4 h-[2.8em]' placeholder='Type your message'/>
             </div> 
                </div>
                </div>
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mt-3" onClick={handleBackPage}>Go Back</button>
                </div>
            </div>
        );
    }
}