import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import {connect} from 'react-redux';

import {signOut} from '../../store/actions/authActions';

import "../../styles/App.css";

/**
 * Navbar links visible to user when signed in
 */
const SignedInLinks = (props) => {
    if(props.auth.isEmpty) return <Redirect to='/' />
    return(
        <Nav>
            <Link to={'/user/' + props.profile.username} className="navbar-link"><Nav.Link as="div">Profile</Nav.Link></Link>
            <Link to='/' className="navbar-link"><Nav.Link as="div" onClick={props.signOut}>Logout</Nav.Link></Link>
        </Nav>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);