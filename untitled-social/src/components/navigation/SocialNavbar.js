import React from 'react';
import {NavLink} from 'react-router-dom';
import {Navbar} from 'react-bootstrap';
import {connect} from 'react-redux';

import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

import '../../styles/App.css';

/**
 * Navbar component fixed at top of site
 */
const SocialNavbar = (props) => {
    
    // Determine if user is signed in, provide correct links
    var links = props.auth.isEmpty ? <SignedOutLinks /> : <SignedInLinks />;
    var logoLink = props.auth.isEmpty ?  "/" : "/feed";

    return(
        <Navbar collapseOnSelect variant="dark" expand="md" fixed="top" className="navbar-wrapper">
            <NavLink to={logoLink}><Navbar.Brand>Untitled Social</Navbar.Brand></NavLink>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="hamburger"/>
            <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                {links}
            </Navbar.Collapse>
        </Navbar>
    )
}

const mapStateToProps = (state) => {
    return{
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(SocialNavbar);