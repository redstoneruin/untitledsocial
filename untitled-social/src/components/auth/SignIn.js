/**
 * Component containing forms for signing in to an Untitled account
 */
import React, {Component} from 'react';
import {Container, Row, Col, Card, Form, Button, Alert} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import {signIn, clearAuthError} from '../../store/actions/authActions';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            emailPattern: new RegExp(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
            validated: false,
            submitted: false,
            valid: {
                email: false,
                password: false,
                emailMessage: null,
                passwordMessage: null
            }
        }
    }

    /**
     * Clear authentication errors on component mount
     */
    componentDidMount = () => {
        this.props.clearAuthError();
    }

    /**
     * Validates email and password in state as formatted correctly
     */
    validateState = () => {
        var valid = {}

        if(!this.state.email) {
            valid.email = false;
            valid.emailMessage = "Please enter your email";
        } else if(this.state.emailPattern.test(this.state.email)) {
            valid.email = true;
            valid.emailMessage = null;
        } else {
            valid.email = false;
            valid.emailMessage = "Please enter a valid email address";
        }

        if(!this.state.password) {
            valid.password = false;
            valid.passwordMessage = "Please enter your password";
        } else if(this.state.password.length < 8){
            valid.password = false;
            valid.passwordMessage = "Password too short";
        } else {
            valid.password = true;
            valid.passwordMessage = null;
        }

        var validated = valid.email && valid.password;

        this.setState({
            valid,
            validated
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.validateState();
        this.setState({
            submitted: true
        }, () => {
            // If form validated, attempt to sign in user
            if(this.state.validated) {
                this.props.signIn({email: this.state.email, password: this.state.password});
            }
        })
    }

    handleChange = (e) => {
        this.props.clearAuthError();
        this.setState({
            [e.target.id]: e.target.value
        }, () => {
            this.validateState();
        });
    }

    render() {
        var errorMessage = this.props.authError ? (
            <Alert variant='danger mt-2'>{this.props.authError}</Alert>
        ) : null

        if(!this.props.auth.isEmpty) return <Redirect to='/feed' />
        return (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} lg={8} xl={6}>
                        <Card className="shadow-sm">
                            <Card.Header as="h5">Login</Card.Header>
                            <Card.Body className="text-left" style={{borderRadius: "3px"}}>
                                <Form onSubmit={this.handleSubmit} noValidate>
                                    <Form.Group>
                                        <Form.Label>Email address</Form.Label>
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

                                    <Button onClick={this.handleSubmit} type="submit" className="primary-button">Login</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        {errorMessage}
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        authError: state.auth.authError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (user) => dispatch(signIn(user)),
        clearAuthError: (user) => dispatch(clearAuthError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);