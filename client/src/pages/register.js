import React from "react";

import NavBarOff from "../components/NavBarOff";

function Register(){
    const addr_register = `http://${process.env.REACT_APP_IP}:8000/register`
    return(
        <div className="register-page">
            <NavBarOff />
            <h1>Hi, Register Page</h1>
            <div className="login-form">
                <div className = 'form-boot'>
                    <form method="POST" action={addr_register}>
                        <h1 className="h3 mb-3 fw-normal">Register</h1>
                
                        <div className="form-floating">
                            <input type="email" className="form-control" id="floatingInput" name="username" placeholder="name@example.com"/>
                             <label htmlFor="floatingInput">Email Address</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password"/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;