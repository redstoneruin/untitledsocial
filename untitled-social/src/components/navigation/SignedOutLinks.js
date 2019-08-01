import React from 'react';
import {Link} from 'react-router-dom';
import {Nav} from 'react-bootstrap';

import "../../styles/App.css";

/**
 * Navbar links visible to user when signed in
 */
const SignedOutLinks = (props) => {
    return(
        <Nav>
            <Link to="/signup" className="navbar-link"><Nav.Link as="div">Sign up</Nav.Link></Link>
            <Link to="/login" className="navbar-link"><Nav.Link as="div">Login</Nav.Link></Link>
        </Nav>
    )
}

export default SignedOutLinks;