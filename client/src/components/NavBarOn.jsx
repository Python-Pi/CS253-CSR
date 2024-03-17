import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function NavBarOn() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };

    return (
        <Navbar expand="lg" className={`bg-black fixed-top text-white`} style={{ paddingTop: "1em"}}>
            <Container>
                <h2 className={`Nav-Head`} onClick={handleClick}>RouteMate</h2>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="ml-auto">
                        <ul className={`nav navbar-nav`}>
                            <li className="nav-item"><a className="nav-link Nav-Name text-white fs-4" href="/home" style={{ paddingTop: "0.1em"}}><button style={{ display: "block", backgroundColor: "rgba(0, 0, 255, 0.8)", paddingInline: "0.4em", paddingTop: "0.1em", paddingBottom: "0.1em", borderRadius: "0.5em"}}>Logout</button></a></li>
                        </ul>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBarOn;
