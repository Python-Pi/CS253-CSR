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
        <Navbar expand="lg" className={`bg-transparent`}>
            <Container>
                <h2 className={`Nav-Head`} onClick={handleClick}>RouteMate</h2>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="ml-auto">
                        <ul className={`nav navbar-nav`}>
                            <li className="nav-item"><a className="nav-link Nav-Name" href="/home">User</a></li>
                        </ul>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBarOn;
