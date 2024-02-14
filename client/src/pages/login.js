import React from "react";

import NavBarOff from "../components/NavBarOff";

function Login(){
    const addr_login = `http://${process.env.REACT_APP_IP}:8000/login`

    return(
        <div className="login-page">
            <NavBarOff />
            <h1>Hi, Login Page</h1>
            <div className="login-form">
                <div className = 'form-boot'>
                    <form method="POST" action={addr_login}>
                        <h1 className="h3 mb-3 fw-normal">Login</h1>
                        <div className="form-floating">
                        <input type="email" className="form-control" id="floatingInput" name="username" placeholder="name@example.com"/>
                        <label htmlFor="floatingInput">Email</label>
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

export default Login;