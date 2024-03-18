import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Navbar, Nav, Col, Container } from "react-bootstrap";

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
    const handleClickLogin = () => {
        navigate('/login');
    };
    const handleClickRegister = () => {
        navigate('/register');
    };
    const [scrolled, ] = useState(true);

    return (

        <div className="routemate-nav-bar">
            <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
                <Container>
                <Navbar.Brand href="/home">
                    <div className="nav-google">
                    <img src={logo} alt="Logo" className="Logo" />
                    <Col>
                    <h2 className="nav-google-name web">Routemate</h2>
                    </Col>
                </div>
                </Navbar.Brand>
        
                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <span className="navbar-toggler-icon"></span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">

                    </Nav>
                    <span className="navbar-text">
                        <HashLink to="/login" >
                            <button className="vvd"><span>Login</span></button>
                        </HashLink>
                    </span>
                    <span className="navbar-text">
                        <HashLink to='/register'>
                            <button className="vvd"><span>Register</span></button>
                        </HashLink>
                    </span>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>

    );
};

export default NavBarOff;
