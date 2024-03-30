import React,{useState, useEffect} from "react";
import {motion} from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../style/trainCell.css";

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
        alert("Successfully unenrolled!");
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
        navigate(`/dashboard/itinerary/train/chat`, {state: {train_number: train.train_base.train_no, date: date, userCount:(confirmed+notBooked), train_name: train.train_base.train_name}});
      }
      else
      {
        console.log("Cannot go to chat room : ",data);
        alert("Enroll in the train to chat!");
      }
    } catch (error) {
      console.log("Some error occured while validating request " , error)
    }
  }

  return (
    <div className="train border-2 border-slate-600 shadow-md shadow-slate-600">
            <h3 className="name">{train.train_base.train_name} : ({train.train_base.train_no})</h3>
            <h4 className="name">Date : {date}</h4>
            <div className="details">
                <div className="train-text">
                <div className="departure pt-3">
                    <p className="text-xl">{train.train_base.source_stn_code}</p>
                </div>
                <div className="journey">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </div>
                <div className="arrival pt-3">
                    <p className="text-xl">{train.train_base.dstn_stn_code}</p>
                </div>
                </div>
                <div className="options">
                    <div className="icons-button">
                        <div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="circle-icon-green" onClick={handleBooked}>
                                <i class="fa-solid fa-user-plus"></i>
                            </motion.div>
                            <h4 id = "cnum" className="confirm number" >{confirmed}</h4>
                        </div>

                        <div>
                            <motion.div 
                              whileHover={{ scale: 1.1 }}
                              className="circle-icon-yellow" onClick={handleNotBooked}>
                                <i class="fa-solid fa-user-plus"></i>
                            </motion.div>
                            <h4 id = "wnum" className="wait number">{notBooked}</h4>
                        </div>


                        <button className="btn mx-[10px] mt-[-30px] btn-dark btn-lg" onClick={handleUnEnroll} >Unenroll</button>
                        <button className="btn mt-[-30px] btn-dark btn-lg"  onClick={handleChatButton}>Chat</button>
                    </div>
                </div>
            </div>        
        </div>
  );
}

export default TrainCell; 
