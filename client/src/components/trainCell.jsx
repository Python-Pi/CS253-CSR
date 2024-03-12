import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function TrainCell(props) {
  const navigate = useNavigate();
  const {train, date} = props;
  const [notBooked,setNotBooked]= useState();
  const [confirmed,setConfirmed]= useState();
  useEffect(()=>{
    setNotBooked(train.train_base.notBooked);
    setConfirmed(train.train_base.confirmed);
  },[train, date]);

  const handleNotBooked= async ()=>{
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/addNotBookedTrainUser`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          credentials:'include',
          body: JSON.stringify(props)
      });

      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      const data= await response.json();
      if(data.success)
      {
        console.log("successful request");
        setConfirmed(data.confirmed);
        setNotBooked(data.notBooked);
      }
      else
      {
        console.log(data.message);
      }
    } catch (error) {
        console.error("Error while sending request to /addNotBookedUser: ", error);
    }
  }

  const handleBooked= async ()=>{
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/addBookedTrainUser`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          credentials:'include',
          body: JSON.stringify(props),
      });

      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      const data= await response.json();
      if(data.success)
      {
        setConfirmed(data.confirmed);
        setNotBooked(data.notBooked);
      }
      else
      {
        console.log(data.message);
      }
    } catch (error) {
        console.error("Error while sending request to /addBookedUser: ", error);
    }
  }

  const handleUnEnroll= async ()=>{
    try {
      const response= await fetch(`http://${process.env.REACT_APP_IP}:8000/removeUserFromTrain`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
        },
        credentials:'include',
        body:JSON.stringify(props),
      });
      if(!response.ok)
      {
        throw new Error("Network response was not ok");
      }
      const data= await response.json();
      if(data.success)
      {
        setConfirmed(data.confirmed);
        setNotBooked(data.notBooked);
      }
      else
      {
        console.log("Cannot remove user from train : ",data);
      }
    } catch (error) {
      console.log("Some error occured while removing user from train " , error)
    }
  }

  const handleChatButton= async ()=>{
    try {
      const response= await fetch(`http://${process.env.REACT_APP_IP}:8000/train_chat`,{
        method:"POST",
        headers:{
          "Content-Type" : "application/json",
        },
        credentials:'include',
        body:JSON.stringify(props),
      });
      if(!response.ok)
      {
        throw new Error("Network response was not ok");
      }
      const data= await response.json();
      if(data.success)
      {
        navigate(`/dashboard/itinerary/train/chat`, {state: {train_number: train.train_base.train_no, date: date}});
      }
      else
      {
        console.log("Cannot go to chat room : ",data);
      }
    } catch (error) {
      console.log("Some error occured while validating request " , error)
    }
  }

  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "5px" }}>
      <div>Train Number: {train.train_base.train_no}</div>
      <div>Origin: {train.train_base.source_stn_code}</div>
      <div>Destination: {train.train_base.dstn_stn_code}</div>
      <div>Date: {date}</div>
      <div>Waiting: {notBooked} <button onClick={handleNotBooked}>+</button></div>
      <div>Confirmed: {confirmed} <button onClick={handleBooked}>+</button></div>
      <button onClick={handleUnEnroll}>Unenroll</button>
      <button onClick={handleChatButton}>Chat Room</button>
    </div>
  );
}

export default TrainCell;
