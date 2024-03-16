import React,{useState, useEffect} from "react";
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
    <div className="train border-2 border-slate-600 shadow-md shadow-slate-600">
            <h3 className="name">Train Number: ({train.train_base.train_no})</h3>
            <div className="details">
                <div className="train-text">
                <div className="departure">
                    <h5>{train.train_base.source_stn_code}</h5>
                </div>
                <div className="journey">
                    <i class="fa-solid fa-arrow-right-arrow-left"></i>
                </div>
                <div className="arrival">
                    <h5>{train.train_base.dstn_stn_code}</h5>
                </div>
                </div>
                <div className="options">
                    <div className="icons-button">
                        <div>
                            <div className="circle-icon-green" onClick={handleBooked}>
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                            <h4 id = "cnum" className="confirm number" >{confirmed}</h4>
                        </div>

                        <div>
                            <div className="circle-icon-yellow" onClick={handleNotBooked}>
                                <i class="fa-solid fa-user-plus"></i>
                            </div>
                            <h4 id = "wnum" className="wait number">{notBooked}</h4>
                        </div>


                        <button className="HSbtn chat-button" >Unenroll</button>
                        <button className="HSbtn chat-button" >Chat</button>
                    </div>
                </div>
            </div>        
        </div>
  );
}

export default TrainCell; 

//  {/* <div className="pb-6 px-4">
//       <div style={{ border: "2px solid black", padding: "20px", margin: "5px", borderRadius: "20px" }} className="block bg-[#EEEEEB] shadow-xl shadow-gray-950">
//         <div className="flex w-full text-3xl font-bold">Train Number: {train.train_base.train_no}</div>
//         <div className="flex flex-row justify-around pt-4 text-xl font-semibold">
//           <div>Origin: {train.train_base.source_stn_code}</div>
//           <div>Destination: {train.train_base.dstn_stn_code}</div>
//           <div>Date: {date}</div>
//         </div>
//         <div className="flex flex-row justify-start pt-4 text-xl font-semibold ">
//           <div className="text-red-600 pr-40 pl-36 ml-1">Waiting: {notBooked} <button onClick={handleNotBooked} className="HSbtn p-1 py-0 ml-2 hover:bg-red-600 w-[1.5em]">+</button></div>
//           <div className="text-green-600 pl-32 ml-1">Confirmed: {confirmed} <button onClick={handleBooked} className="HSbtn p-1 py-0 ml-2 w-[1.5em]">+</button></div>
//         </div>
//         <div className="flex flex-row justify-end gap-x-8 pr-6 pt-4">
//           <button onClick={handleUnEnroll} className="HSbtn">Unenroll</button>
//           <button onClick={handleChatButton} className="HSbtn">Chat Room</button>
//         </div>
//       </div>
//     </div> */}