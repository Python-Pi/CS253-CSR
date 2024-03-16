import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from "../Assets/logo.png";
import "../style/NavBar.css";

function NavBarOff() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigate = useNavigate();
    const handleClickHome = () => {
        navigate('/home');
    };
    const handleClickLogin = () => {
        navigate('/login');
    };
    const handleClickRegister = () => {
        navigate('/register');
    };
    return (

        <div>
            {windowWidth > 768 ? (
                <Navbar expand="lg" className={`bg-transparent Nav-Bar`}>
                    <Container>
                        <img src={logo} alt="logo" className={`Nav-Head Nav-img`} onClick={handleClickHome}/>
                        {/* <h2 className={`Nav-Head`} onClick={handleClick} >RouteMate</h2> */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="ml-auto">
                                <ul className={`nav navbar-nav`}>
                                    <button type="button" className="HSbtn btn-primary btn-lg mr-2" onClick={handleClickLogin}>Login</button>
                                    <button type="button" className="HSbtn btn-primary btn-lg ml-2" onClick={handleClickRegister}>Register</button>
                                </ul>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            ):(
                <Navbar expand="lg" className={`bg-transparent Nav-Bar`}>
                    <Container>
                        <img src={logo} alt="logo" className={`Nav-Head Nav-img`} onClick={handleClickHome}/>
                        {/* <h2 className={`Nav-Head`} onClick={handleClick} >RouteMate</h2> */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="ml-auto">
                                <ul className={`nav navbar-nav`}>
                                    <li className="nav-item"><a className="nav-link Nav-Name text-center" href="/login">Login</a></li>
                                    <li className="nav-item"><a className="nav-link Nav-Name text-center" href="/register">Register</a></li>
                                </ul>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}
        </div>


    );
};

export default NavBarOff;
