import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Container, Row, Col, Card, Form, Button, Alert} from 'react-bootstrap';
import {connect} from 'react-redux';

import '../../styles/ColorScheme.css';

import {validateUsername, validateBio} from '../../shared/validation';
import {updateProfile, clearProfileUpdateError} from '../../store/actions/authActions';

/**
 * Form for updating profile for signed in users
 */
class ProfileUpdateForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: this.props.profile.username,
            bio: this.props.profile.bio,
            validated: false,
            redirect: false,
            valid: {
                username: false,
                usernameMessage: null,
                bio: false,
                bioMessage: null
            }
        }
    }

    /**
     * Validate state on component mount
     */
    componentDidMount = () => {
        if(this.state.bio === null) {
            this.setState({
                bio: ""
            });
        }

        this.validateState();
    }

    /**
     * Validate state for correct input format
     */
    validateState = () => {
        // Validate individual fields
        var userValid = validateUsername(this.state.username);
        var bioValid = validateBio(this.state.bio);

        // Combine into valid object
        var valid = Object.assign(userValid, bioValid);
        var validated = valid.username && valid.bio;
        this.setState({
            validated,
            valid
        })
    }

    /**
     * Check if component needs to redirect each update
     */
    componentDidUpdate = () => {
        if(this.props.route !== this.props.profile.username) {
            this.setState({
                redirect: true
            })
        }
    }

    /**
     * Updates user profile when button clicked
     */
    handleUpdateProfile = (e) => {
        e.preventDefault();
        this.props.clearProfileUpdateError();
        if(this.state.validated) {
            var profile = {
                username: this.state.username,
                bio: this.state.bio
            }

            this.props.updateProfile(this.props.auth.uid, profile)
            // If successful, toggle profile update
            .then(() => {
                this.props.updateUserProfileInfo();
                // Only toggle form if not redirecting
                if(this.props.route === this.props.profile.username) {
                    this.props.toggleProfileUpdate();
                }
            });
            
        }
    }

    /**
     * Handle state changes on form update
     */
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        }, () => {
            // validate state after update
            this.validateState();
        })
    }

    render() {
        var profileUpdateWarning = this.props.authStore.profileUpdateError ? (
            <Alert variant="danger" className="mt-2">{this.props.authStore.profileUpdateError}</Alert>
        ) : null

        if(this.state.redirect) return <Redirect to={'/user/' + this.props.profile.username} />

        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        <Card className="tertiary shadow">
                            <Card.Body>
                                <Card.Title>Update Profile</Card.Title>
                                <Form onSubmit={this.handleUpdateProfile}>
                                    <Form.Group>
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            type="text"
                                            id="username"
                                            defaultValue={this.state.username}
                                            isValid={this.state.valid.username}
                                            isInvalid={!this.state.valid.username}>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{this.state.valid.usernameMessage}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            as="textarea"
                                            rows="3"
                                            id="bio"
                                            defaultValue={this.state.bio}
                                            isValid={this.state.valid.bio}
                                            isInvalid={!this.state.valid.bio}>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{this.state.valid.bioMessage}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                                <div className="text-right">
                                    <Button 
                                    className="primary-button shadow-sm mr-2" 
                                    onClick={this.handleUpdateProfile}>Update Profile</Button>
                                    <Button 
                                    className="shadow-sm" 
                                    variant='danger' onClick={() => {
                                        this.props.clearProfileUpdateError();
                                        this.props.toggleProfileUpdate();
                                    }}>Cancel</Button>
                                </div>
                            </Card.Body>
                        </Card>
                        {profileUpdateWarning}
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authStore: state.auth,
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (uid, profile) => dispatch(updateProfile(uid, profile)),
        clearProfileUpdateError: () => dispatch(clearProfileUpdateError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileUpdateForm);