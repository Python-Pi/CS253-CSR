import React from "react";
import NavBarOff from "../components/NavBarOff";
import Footer from "../components/Footer";

function Register(){
    const addr_register = `http://${process.env.REACT_APP_IP}:8000/register`
    return(
        <div className="register-page">
            <NavBarOff />
            <div className="login-form">
                <div className = 'form-boot'>
                    <form method="POST" action={addr_register}>
                        <h1 className="h3 mb-3 fw-normal mt-3 text-center">Register</h1>

                        <div className="form-floating mb-1">
                            <input type="username" className="form-control" id="floatingInput" name="name" placeholder="Username"/>
                             <label htmlFor="floatingInput">Login Name</label>
                        </div>
                        <div className="form-floating mb-1">
                            <input type="email" className="form-control" id="floatingInput" name="username" placeholder="name@example.com"/>
                             <label htmlFor="floatingInput">Email Address</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password"/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="btn btn-primary w-100 py-2 mb-3" type="submit">Sign up</button>
                    </form>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Register;