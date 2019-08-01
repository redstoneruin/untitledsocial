import React, {Component} from 'react';
import {Container, Row, Col, Card, Form, Button} from 'react-bootstrap';

import '../../styles/ColorScheme.css';

/**
 * Form for updating profile for signed in users
 */
class ProfileUpdateForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            bio: ""
        }
    }

    /**
     * Updates user profile when button clicked
     */
    handleUpateProfile = (e) => {
        e.preventDefault();
    }

    render() {
        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        <Card className="tertiary shadow">
                            <Card.Body>
                                <Card.Title>Update Profile</Card.Title>
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            type="text"
                                            id="username">
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            as="textarea"
                                            rows="3"
                                            id="bio">
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                                <div className="text-right">
                                    <Button 
                                    className="primary-button shadow-sm mr-2" 
                                    onClick={this.handleUpateProfile}>Update Profile</Button>
                                    <Button 
                                    className="shadow-sm" 
                                    variant='danger' onClick={this.props.toggleProfileUpdate}>Cancel</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ProfileUpdateForm;