import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Container, Card, Spinner, Row, Col, Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import {getProfileByUsername} from '../../store/actions/authActions';

import ProfileUpdateForm from './ProfileUpdateForm';
import CreatePost from '../feed/CreatePost';

/**
 * User profile component
 */
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: props.match.params.id,
            updateFormVisible: false,
            createPostFormVisible: false
        }
    }

    /**
     * Get profile data on component mount
     */
    componentDidMount = () => {
        this.updateUserProfileInfo();
    }

    /**
     * Update profile information
     */
    updateUserProfileInfo = () => {
        this.props.getProfileByUsername(this.props.match.params.id);
    }

    /**
     * Update profile if route changes
     */
    componentDidUpdate = () => {
        if(this.props.match.params.id !== this.state.route) {
            this.setState({
                route: this.props.match.params.id,
                updateFormVisible: false
            }, () => {
                // after setting state, update profile data
                this.props.getProfileByUsername(this.state.route);
            })
        }
    }

    /**
     * Toggle update form visibility
     */
    toggleProfileUpdate = () => {
        this.setState({
            updateFormVisible: !this.state.updateFormVisible
        })
    }
    /**
     * Toggle create post form visibility
     */
    toggleCreatePostForm = () => {
        this.setState({
            createPostFormVisible: !this.state.createPostFormVisible
        })
    }

    
    render() {

        /**
         * Loading screen visible before profile information loaded
         */
        var loadingScreen = (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Profile is loading</Card.Title>
                                <Spinner className="mt-3" animation="border"></Spinner>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )


        // Profile update form to display to logged in users
        var profileUpdateForm = this.state.updateFormVisible ? (
            <ProfileUpdateForm 
            toggleProfileUpdate={this.toggleProfileUpdate} 
            updateUserProfileInfo={this.updateUserProfileInfo}
            route={this.state.route} />
        ) : (
            // only display update profile button if on current user's profile
            this.props.loadedProfile && this.props.loadedProfile.username === this.props.profile.username ? (
                <Button variant="info" className="mr-2 shadow-sm" onClick={this.toggleProfileUpdate}>Update Profile</Button>
            ) : null
        )

        // Determine whether to show create post form or button to expand
        var createPostForm =  this.state.createPostFormVisible ? (
            <CreatePost toggleCreatePostForm={this.toggleCreatePostForm} />
        ) :  null

        var createPostButton = this.props.loadedProfile 
        && !this.state.createPostFormVisible
        && this.props.loadedProfile.username === this.props.profile.username ? (
            <Button className="primary-button shadow-sm mr-2" onClick={this.toggleCreatePostForm}>Create Post</Button>
        ) : null

        if(!this.props.auth.uid) return <Redirect to='/login' />

        // Display if load error present
        if(this.props.userLoadError) return (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Oh no! We ran into an error.</Card.Title>
                                <Card.Text>{this.props.userLoadError}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );

        // return loading screen if no profile data yet
        if(!this.props.loadedProfile) return loadingScreen;
        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        <Card className="shadow secondary">
                            <Card.Body className="text-left">
                                <Card.Title>{this.props.loadedProfile.username}</Card.Title>
                                <Card.Text>{this.props.loadedProfile.bio ? this.props.loadedProfile.bio : (
                                    null
                                )}</Card.Text>
                                <div className="text-right">
                                    {profileUpdateForm}
                                    {createPostButton}
                                </div>
                            </Card.Body>
                        </Card>
                        {createPostForm}
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        loadedProfile: state.auth.loadedProfile,
        userLoadError: state.auth.userLoadError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProfileByUsername: (username) => dispatch(getProfileByUsername(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);