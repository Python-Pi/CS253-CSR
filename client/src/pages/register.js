import React, { useState } from "react";
import NavBarOff from "../components/NavBarOff";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../style/styles.css"

function Register(){
    const navigate = useNavigate();
    const addr_register = `http://${process.env.REACT_APP_IP}:8000/register`
    const [Hdata, setHdata] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [Hmessage, setHmessage] = useState("");

    const handleChange = (e) => {
        setHdata({
            ...Hdata,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(Hdata.name===""){
            setHmessage("Name cannot be empty");
            return;
        }
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(Hdata.email==="" || !re.test(Hdata.email)){
            setHmessage("Invalid Email");
            return;
        }
        if(Hdata.password===""){
            setHmessage("Password cannot be empty");
            return;
        }

        setHmessage("");
        try {
            const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/sendOTP`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: Hdata.email})
            })
            if(!response.ok)
            {
                console.log("error while sending OTP");
                navigate("/home");
                return;
            }
            const data = await response.json();
            if(data.success)
            {
                alert("An OTP has been sent to your email");
                navigate("/otp", {state: {email: Hdata.email, password: Hdata.password, name: Hdata.name}});
            }
            else
            {
                alert("some error occured while sending OTP.. please try again later");
                navigate("/home");
            }
        } catch (error) {
            console.log("error while sending OTP : ",error);
        }
    }
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        // try {
        //     const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/sendOTP`,{
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({email: e.target.email.value})
        //     })
        //     if(!response.ok)
        //     {
        //         console.log("error while sending OTP");
        //         navigate("/home");
        //         return;
        //     }
        //     const data = await response.json();
        //     if(data.success)
        //     {
        //         alert("An OTP has been sent to your email");
        //         navigate("/otp", {state: {email: e.target.email.value, password: e.target.password.value, name: e.target.name.value}});
        //     }
        //     else
        //     {
        //         alert("some error occured while sending OTP.. please try again later");
        //         navigate("/home");
        //     }
        // } catch (error) {
        //     console.log("error while sending OTP : ",error);
        // }
    // }
    
    return(
        <div className="register-page mt-20">
            <NavBarOff />
            <div className="login-form">
                <div className = 'form-boot'>
                    <form className="flex flex-col">
                        <h1 className="h3 mb-3 fw-normal mt-3 text-center">Register</h1>

                        <div className="form-floating mb-1">
                            <input type="username" className="form-control" id="floatingInput" onChange={handleChange} name="name" placeholder="Username"/>
                             <label htmlFor="floatingInput">User Name</label>
                        </div>
                        <div className="form-floating mb-1">
                            <input type="email" className="form-control" id="floatingInput" onChange={handleChange} name="email" placeholder="name@example.com"/>
                             <label htmlFor="floatingInput">Email Address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" onChange={handleChange} name="password" placeholder="Password"/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="btn btn-dark w-50 self-center py-2 mb-3" type="submit" onClick={handleSubmit}>Sign up</button>
                        <div className="text-center text-red-600">{Hmessage}</div>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;