/**
 * Contains form for signing up for an Untitled Social account
 */
import React, {Component} from 'react';
import {Container, Card, Row, Col, Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import {signUp} from '../../store/actions/authActions';

import '../../styles/ColorScheme.css';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            submitted: false,
            validated: false,
            valid: {
                email: false,
                password: false,
                confirmPassword: false,
                username: false,
                emailMessage: null,
                passwordMessage: null,
                confirmPasswordMessage: null,
                usernameMessage: null
            }
        }
    }


    /**
     * validates fields in state
     */
    validateState = () => {
        
        var valid = {}

        // Validate username
        if(!this.state.username) {
            valid.username = false;
            valid.usernameMessage = "Please enter a username";
        } else if(this.state.username.length < 5) {
            valid.username = false;
            valid.usernameMessage = "Username must be more than 5 characters";
        } else {
            valid.username = true;
            valid.usernameMessage = null;
        }

        // Validate email
        if(!this.state.email) {
            valid.email = false;
            valid.emailMessage = "Please enter an email";
        } 
        // test for email format
        else if(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) {
            valid.email = true;
            valid.emailMessage = null;
        } else {
            valid.email = false;
            valid.emailMessage = "Please enter a valid email"
        }

        // validate password
        if(!this.state.password) {
            valid.password = false;
            valid.passwordMessage = "Please enter a password";
        } else if(this.state.password.length < 8) {
            valid.password = false;
            valid.passwordMessage = "Password must be 8 characters or more";
        } else {
            valid.password = true;
            valid.passwordMessage = null;
        }

        // validate comfirmPassword
        if(!this.state.confirmPassword) {
            valid.confirmPassword = false;
            valid.confirmPasswordMessage = "Please confirm your password";
        } else if(this.state.confirmPassword !== this.state.password) {
            valid.confirmPassword = false;
            valid.confirmPasswordMessage = "Your passwords don't match";
        } else {
            valid.confirmPassword = true;
            valid.confirmPasswordMessage = null;
        }

        this.setState({
            valid
        })
    }

    /**
     * Signs up new user if form is valid fields correct
     */
    handleSubmit = (e) => {
        e.preventDefault();

        this.validateState();

        this.setState({
            submitted: true
        })
    }

    /**
     * Changes the state of this component as form is altered
     */
    handleChange = (e) => {
        // Set state to updated form value
        this.setState({
            [e.target.id]: e.target.value
        }, () => {
            // Validate form after function callback
            this.validateState();
        });
    }

    render() {

        return (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} lg={8} xl={6}>
                            <Card className="shadow-sm">
                                <Card.Header as="h5">Sign Up</Card.Header>
                                <Card.Body className="text-left">
                                    <Form onSubmit={this.handleSubmit} noValidate>
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                required
                                                onChange={this.handleChange} 
                                                type="text" 
                                                id="username"
                                                isValid={this.state.valid.username}
                                                isInvalid={this.state.submitted && !this.state.valid.username}>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{this.state.valid.usernameMessage}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control 
                                                required
                                                onChange={this.handleChange} 
                                                type="email" 
                                                id="email"
                                                isValid={this.state.valid.email}
                                                isInvalid={this.state.submitted && !this.state.valid.email}>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{this.state.valid.emailMessage}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control 
                                                required
                                                onChange={this.handleChange} 
                                                type="password" 
                                                id="password"
                                                isValid={this.state.valid.password}
                                                isInvalid={this.state.submitted && !this.state.valid.password}>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{this.state.valid.passwordMessage}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control 
                                                required
                                                onChange={this.handleChange} 
                                                type="password" 
                                                id="confirmPassword"
                                                isValid={this.state.valid.confirmPassword}
                                                isInvalid={this.state.submitted && !this.state.valid.confirmPassword}>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">{this.state.valid.confirmPasswordMessage}</Form.Control.Feedback>
                                        </Form.Group>

                                        <Button onClick={this.handleSubmit} type="submit" className="primary-button">Sign Up</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (newUser) => dispatch(signUp(newUser))
    }
}

export default connect(mapDispatchToProps)(SignUp);