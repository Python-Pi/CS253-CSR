import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTrip = () => {
    const [info, setMessage] = useState("");
    const navigate = useNavigate();
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState(null);

    const handleDetailsChange = (event) => {
        setDetails(event.target.value);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleTripNameChange = (e) => {
        setTripName(e.target.value);
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tripName || !destination || !startDate || !endDate || !amount) {
            // Display an error message or perform any other action
            alert("Please fill in all the fields");
            return;
        }

        if (isNaN(amount)) {
            alert("Amount must be a number");
            return;
        }

        const formData = new FormData();

        formData.append('tripName', tripName);
        formData.append('destination', destination);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('amount', amount);
        formData.append('details', details);
        formData.append('image', image); 

        fetch(`http://${process.env.REACT_APP_IP}:8000/api/travel/addTrip`, {
            credentials: 'include',
            method: 'POST',
            body: formData
        })
        .then((res) => {
            const status = res.status;
            if(status){
                alert("Trip added");
                navigate('/travel');
            } else {
                alert("Something went wrong. Try Again!");
                return;
            }
        })
        .catch((error) => {
            alert(error.message);
        });
    };



    useEffect(() => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/login`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => setMessage(data));
    }, []);  
    
    if(!info.status){
        navigate('/home');
        return null;
    } else {
        if(!info.loggedIn){
            navigate('/home');
            return null;
        } else {
            return(
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='py-4'>
                    <button className='HSbtn absolute top-0 left-0 mt-4 ml-10' onClick={() => navigate('/travel')}>Go back</button>
                    <div className='block px-24 bg-[#EEEEEB] shadow-xl shadow-gray-950 pb-10 rounded-[20px] w-[50em] border-2 border-slate-600'>
                        <h2 className='text-6xl text-center py-10 font-semibold'>Add Trip</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-row justify-between pb-4'>
                                <div className="form-group pr-2">
                                    <label className='text-2xl font-medium'>Trip Name:</label>
                                    <input type="text" className="form-control" value={tripName} onChange={handleTripNameChange} />
                                </div>
                                <div className="form-group pl-2">
                                    <label className='text-2xl font-medium'>Destination:</label>
                                    <input type="text" className="form-control" value={destination} onChange={handleDestinationChange} />
                                </div>
                            </div>
                            <div className='flex flex-row justify-between pb-4'>
                                <div className="form-group">
                                    <label className='text-2xl font-medium'>Start Date:</label>
                                    <input type="date" className="form-control min-w-[13.9em]" value={startDate} onChange={handleStartDateChange} />
                                </div>
                                <div className="form-group">
                                    <label className='text-2xl font-medium'>End Date:</label>
                                    <input type="date" className="form-control min-w-[13.9em]" value={endDate} onChange={handleEndDateChange} />
                                </div>
                            </div>
                            <div className="form-group pb-4">
                                <label className='text-2xl font-medium'>Amount</label>
                                <input type="" className="form-control max-w-[13.9em]" value={amount} onChange={handleAmountChange} />
                            </div>
                            <div className="form-group pb-4">
                                <label className='text-2xl font-medium'>Details:</label>
                                <textarea className="form-control" value={details} onChange={handleDetailsChange} />
                            </div>
                            <div className="form-group pb-4">
                                <label className='text-2xl font-medium pb-1'>Image:</label>
                                <input type="file" className="form-control" onChange={handleImageChange} />
                            </div>
                            <button className="HSbtn btn-primary mt-3" onClick={handleSubmit} >Create a new trip</button>
                        </form>
                    </div>
                </div>
            )
        }
    }
};

export default AddTrip;