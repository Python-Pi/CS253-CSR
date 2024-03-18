import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import { Navbar, Nav, Container } from "react-bootstrap";
import {Col } from "react-bootstrap";
import logo from "../Assets/logo.png";
import "../style/styles.css";

function NavBarOn() {
    const navigate = useNavigate();
    const handleLogout = () => {
        fetch(`http://${process.env.REACT_APP_IP}:8000/api/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        .then(() => {
            navigate('/home');
        });
    };

    const [activeLink, ] = useState('home');
    const [scrolled, ] = useState(true);

    return (
       <div className="routemate-nav-bar">
          <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
            <Container>
              <Navbar.Brand href="/dashboard">
                <div className="nav-google">
                <img src={logo} alt="Logo" className="Logo" />
                <Col>
                <h2 className="nav-google-name web">RouteMate</h2>
                </Col>
              </div>
              </Navbar.Brand>
      
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <span className="navbar-toggler-icon"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                 <Nav.Link href="/dashboard" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}>Dashboard</Nav.Link>
                  <Nav.Link href="/travel" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'}>Travel</Nav.Link>
                  <Nav.Link href="/dashboard/itinerary/train" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'}>Itinerary</Nav.Link>
                  <Nav.Link href="/blogs" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'}>Blogs</Nav.Link>
                </Nav>
                <span className="navbar-text">
                  <HashLink>
                    <button className="vvd" onClick={handleLogout}><span>Logout</span></button>
                  </HashLink>
                </span>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      </div>
    );
};

export default NavBarOn;
