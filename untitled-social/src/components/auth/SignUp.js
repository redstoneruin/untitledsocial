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
            displayName: ""
        }
    }

    /**
     * Validates input fields, signs up new user if fields correct
     */
    handleSubmit = (e) => {
        e.preventDefault();

    }

    render() {
        return (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} lg={8} xl={6}>
                            <Card className="shadow-sm">
                                <Card.Header as="h5">Sign Up</Card.Header>
                                <Card.Body className="text-left">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="signupUsername">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type="text"></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="signupEmail">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control type="email"></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="signupPass">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password"></Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="signupConfirmPass">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control type="password"></Form.Control>
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