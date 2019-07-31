/**
 * Navbar links visible to user when signed in
 */
import React from 'react';
import {Nav} from 'react-bootstrap';

const SignedInLinks = () => {
    return(
        <Nav>
            <Nav.Link as="div">Logout</Nav.Link>
        </Nav>
    )
}

export default SignedInLinks;