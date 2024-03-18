import React from "react";

import NavBarOff from "../components/NavBarOff";
import Footer from "../components/Footer";

function Login(){
    const addr_login = `http://${process.env.REACT_APP_IP}:8000/login`
    
    return(
        <div className="login-page mt-20">
            <NavBarOff />
            <div className="login-form">
                <div className = 'form-boot'>
                    <form method="POST" action={addr_login} className="flex flex-col">
                        <h1 className="h3 mb-3 text-center mt-3">Login</h1>

                        <div className="form-floating mb-1">
                            <input type="email" className="form-control" id="floatingInput" name="username" placeholder="name@example.com"/>
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="password" className="form-control" id="floatingPassword" name="password" placeholder="Password"/>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="HSbtn w-50 self-center py-2" type="submit">Sign in</button>
                    </form>
                    <div className="login-register">
                        <p className="mt-3">New to Routemate? <a href="/register">Register here</a>.</p>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Login;