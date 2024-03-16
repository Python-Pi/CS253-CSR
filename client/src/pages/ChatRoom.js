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
                <div className='bg-white h-[50em] box-border font-serif'>
                    <div className='flex justify-center items-center wpbg min-h-[100%]'>
                        <div className='relative w-[1396px] max-w-[100%] h-[calc(100vh-40px)] bg-white sshdw overflow-x-hidden'>
                <div className='relative flex w-full h-[60px]
      bg-[#ededed] '>
        <div className='w-[80px]'>
         <img src={dp4} className='ssrch h-[50px] w-[60px] pl-[15px] pt-[8px]'/>
        </div>
        <div className='w-[290px] font-sans'>
        <div className='h-40px text-xl'>Train Number {train_number}</div>
        <div className='h-20px text-sm'>10 members, {date}</div>
        </div>
      </div>
      <div className='relative w-full h-[calc(100%-120px)] pt-[20px] overflow-y-auto overflow-x-hidden'>
                <ul>
                    {messages.map((message, index) => {
                        if (message.message.startsWith(train_number + date)) {
                            const newMessage = message.message.substring((train_number + date).length);
                            if(username == message.username) return (<>
                                <li key={index} className="">
                                <div className='relative w-full pl-[1050px] ml-1 mt-[5px] mb-[5px]'>
                                <div className='flex -mb-2'>
                                <div className='rounded-[50%] w-2 h-2 mt-2 mr-2 bg-[rgb(101,209,119)]'></div>
                                <p className='mb-[-2px] mr-2'>{message.username}</p>
                                <p className='mb-[-15px] text-gray-500'>12:15</p>
                                </div>
                                    <span class="top-bot"></span>
                                    <span class="top-bot top-bot-border"></span>
                                    <p  className='flex justify relative right-0 mb-[15px] text-justify max-w-[17em] p-[12px] bg-[rgb(101,209,119)] rounded-lg break-words'>{newMessage}</p>
                                    </div> 
                                </li>
                               </>
                                    // </div>
                                    
                            );
                            else return (<>
                                <li key={index} className="">
                                <div className='relative w-full pl-[10px] ml-1 mt-[5px] mb-[5px]'>
                                <div className='flex -mb-2'>
                                <div className='rounded-[50%] w-2 h-2 mt-2 mr-2 bg-[#5dbff6]'></div>
                                <p className='mb-[-2px] mr-2'>{message.username}</p>
                                <p className='mb-[-15px] text-gray-500'>12:15</p>
                                </div>
                                    <span class="top-bot1"></span>
                                    <span class="top-bot1 top-bot-border"></span>
                                    <p  className='flex justify relative right-0 mb-[15px] text-justify max-w-[17em] p-[12px] bg-[#5dbff6] rounded-lg break-words'>{newMessage}</p>
                                    </div> 
                                </li>
                               </>
                                    // </div>
                                    
                            );
                        } else {
                            return null;
                        }
                    })}
                </ul>
      </div>
             <div className='relative w-full h-[60px] sinp justify-between flex p-[5px] bg-[#f0f0f0] items-center'>
            <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyPress} className='relative w-[90%]  rounded-[30px] text-[1em] pl-4 h-[45px]' placeholder='Type your message'/>
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