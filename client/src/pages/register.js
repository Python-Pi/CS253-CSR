import React from "react";
import NavBarOff from "../components/NavBarOff";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../style/styles.css"

function Register(){
    const navigate = useNavigate();
    const addr_register = `http://${process.env.REACT_APP_IP}:8000/register`

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch(`http://${process.env.REACT_APP_IP}:8000/sendOTP`,{
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({email: e.target.email.value})
    //         })
    //         if(!response.ok)
    //         {
    //             console.log("error while sending OTP");
    //             navigate("/home");
    //             return;
    //         }
    //         const data = await response.json();
    //         if(data.success)
    //         {
    //             alert("An OTP has been sent to your email");
    //             navigate("/otp", {state: {email: e.target.email.value, password: e.target.password.value, name: e.target.name.value}});
    //         }
    //         else
    //         {
    //             alert("some error occured while sending OTP.. please try again later");
    //             navigate("/home");
    //         }
    //     } catch (error) {
    //         console.log("error while sending OTP : ",error);
    //     }
    // }
    
    return(
        <div className="register-page mt-20">
            <NavBarOff />
            <div className="login-form">
                <div className = 'form-boot'>
                    <form method="POST" action={addr_register} className="flex flex-col">
                        <h1 className="h3 mb-3 fw-normal mt-3 text-center">Register</h1>

                        <div className="form-floating mb-1">
                            <input type="username" className="form-control" id="floatingInput" name="name" placeholder="Username"/>
                             <label htmlFor="floatingInput">Login Name</label>
                        </div>
                        <div className="form-floating mb-1">
                            <input type="email" className="form-control" id="floatingInput" name="email" placeholder="name@example.com"/>
                             <label htmlFor="floatingInput">Email Address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password"/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="HSbtn w-50 self-center py-2 mb-3" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;