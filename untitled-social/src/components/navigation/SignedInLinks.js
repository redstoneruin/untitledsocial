/**
 * Navbar links visible to user when signed in
 */
import React from 'react';
import {Redirect, Link} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import {connect} from 'react-redux';

import {signOut} from '../../store/actions/authActions';

const SignedInLinks = (props) => {
    if(props.auth.isEmpty) return <Redirect to='/' />
    return(
        <Nav>
            <Link to='/'><Nav.Link as="div" onClick={props.signOut}>Logout</Nav.Link></Link>
        </Nav>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);