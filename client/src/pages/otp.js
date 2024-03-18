import React from "react";
import { useNavigate } from "react-router-dom";
import NavBarOff from "../components/NavBarOff";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

export default function Otp() {
    const navigate = useNavigate();
    const location = useLocation();
    const {name, password, email} = location.state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response=await fetch(`http://${process.env.REACT_APP_IP}:8000/verifyOTP`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, OTP: e.target.otp.value})
            })
            const data = await response.json();
            if(data.success)
            {
                console.log("otp verified");
                await fetch(`http://${process.env.REACT_APP_IP}:8000/register`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name: name, email: email, password: password})
                })
                alert("Registered Successfully");
                navigate("/login");
            }
            else
            {
                console.log("otp incorrect");
                alert("Incorrect OTP");
                navigate("/home");
            }
        } catch (error) {
            console.log("error while registering : ",error);   
        }
    }
    return(
        <div className="otp-page">
            <NavBarOff />
            <div className="login-form">
                <div className = 'form-boot'>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <h1 className="h3 mb-3 text-center mt-3">OTP</h1>

                        <div className="form-floating mb-1">
                            <input type="text" className="form-control" id="floatingInput" name="otp" placeholder="Enter OTP"/>
                            <label htmlFor="floatingInput">Enter OTP</label>
                        </div>
                        <button className="HSbtn w-50 self-center py-2" type="submit">Submit</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}