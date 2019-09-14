import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Container, Card, Spinner, Row, Col, Button, Image} from 'react-bootstrap';
import {connect} from 'react-redux';

import {getProfileByUsername, getAvatarURLFromUsername, followUser, unfollowUser, checkIfFollower} from '../../store/actions/authActions';
import {updateUserFeed} from '../../store/actions/postActions';

import ProfileUpdateForm from './ProfileUpdateForm';
import Feed from '../feed/Feed';
import unknownUserImg from '../../assets/unknownuser.png';

import '../../styles/App.css';

/**
 * User profile component
 */
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: props.match.params.id,
            updateFormVisible: false,
            createPostFormVisible: false,
            profilePicURL: null,
            isFollower: false,
            checkedIfFollowing: false
        }
    }

    /**
     * Get profile data on component mount
     */
    componentDidMount = () => {
        this.updateUserProfileInfo();
    }

    /**
     * Update profile information, including profile picture
     */
    updateUserProfileInfo = () => {
        this.props.getProfileByUsername(this.props.match.params.id);

        this.props.getAvatarURLFromUsername(this.props.match.params.id)
            .then(url => {
                // if url exists, change Image src property
                if(url) {
                    this.setState({
                        profilePicURL: url
                    })
                }
            })
            .catch(err => {
                console.log(err);
            });

        this.props.updateUserFeed(this.props.match.params.id);
    }

    /**
     * Check if current user if follower
     */
    checkIfFollower = (uid) => {
        this.props.checkIfFollower(uid)
            .then(isFollower => {
                this.setState({
                    isFollower,
                    checkedIfFollowing: true
                });
                }
            );
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
                this.updateUserProfileInfo();
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
        // update feed if form to be closed
        if(this.state.createPostFormVisible) {
            this.props.updateUserFeed(this.state.route);
        }
        this.setState({
            createPostFormVisible: !this.state.createPostFormVisible
        })
    }

    /**
     * Handler for user clicking follow button
     */
    handleFollow = () => {
        /** Use function to follow user */
        this.props.followUser(this.props.loadedProfile.uid)
            .then(isFollower => {
                this.setState({
                    isFollower,
                    checkedIfFollowing: true
                });
            });
    }

    handleUnfollow = () => {
        this.props.unfollowUser(this.props.loadedProfile.uid)
            .then(this.setState({
                isFollower: false,
                checkedIfFollowing: true
            }));
    }

    
    render() {
        /**
         * Check if logged in user is following this user
         */
        if(this.props.loadedProfile && !this.state.checkedIfFollowing) {
            this.checkIfFollower(this.props.loadedProfile.uid);
        }

        /**
         * Loading screen visible before profile information loaded
         */
        var loadingScreen = (
            <Container className="pt-4">
                <Row className="justify-content-center">
                    <Col>
                        <Card className="secondary shadow-sm">
                            <Card.Body>
                                <Spinner animation="border" variant="info" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )

        // button for updating profile, must be viewing profile of currently logged in user
        var updateProfileButton = this.props.loadedProfile 
        && this.props.loadedProfile.username === this.props.profile.username ? (
            <Button variant="info" className="mr-2 shadow-sm" onClick={this.toggleProfileUpdate}>Update Profile</Button>
        ) : null;

        /** Button for other users to follow this account */
        var followButton = this.props.loadedProfile
        /** loaded profile must not be currently logged in user */
        && this.props.loadedProfile.uid !== this.props.auth.uid ? (
            /** decide between follow and unfollow button */
            this.state.isFollower ? (
                <Button variant="danger" className="mr-2 shadow-sm" onClick={this.handleUnfollow}>Unfollow</Button>
            ) : (
                <Button variant="info" className="mr-2 shadow-sm" onClick={this.handleFollow}>Follow</Button>
            )
        ) : null;

        // Profile card visible to user, either profile or update form
        var profileCard = this.props.loadedProfile && !this.state.updateFormVisible ? (
            <Card className="shadow secondary">
                <Card.Body className="text-left">
                    <div className="profile-avatar-container mb-3">
                        <Image
                        id="profilePic" 
                        src={this.state.profilePicURL ? this.state.profilePicURL : unknownUserImg} 
                        alt="Avatar" 
                        height="64px"/>
                    </div>

                    <Card.Title>{this.props.loadedProfile.username}</Card.Title>
                    <Card.Text>{this.props.loadedProfile.bio ? this.props.loadedProfile.bio : null}</Card.Text>
                    <div className="text-right">
                        {updateProfileButton}
                        {followButton}
                    </div>
                </Card.Body>
            </Card>
        ) : (
            <ProfileUpdateForm 
            toggleProfileUpdate={this.toggleProfileUpdate} 
            updateUserProfileInfo={this.updateUserProfileInfo}
            route={this.state.route} />
        );

        // route guard
        if(!this.props.auth.uid) return <Redirect to='/login' />;

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
            <div>
                <Container className="pt-4">
                    <Row className="justify-content-center">
                        <Col md={10}>
                            {profileCard}
                        </Col>
                    </Row>
                </Container>
                <Feed userFeed={true} />
            </div>
        );
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
        getProfileByUsername: (username) => dispatch(getProfileByUsername(username)),
        updateUserFeed: (username) => dispatch(updateUserFeed(username)),
        getAvatarURLFromUsername: (username) => dispatch(getAvatarURLFromUsername(username)),
        followUser: (uid) => dispatch(followUser(uid)),
        unfollowUser: (uid) => dispatch(unfollowUser(uid)),
        checkIfFollower: (uid) => dispatch(checkIfFollower(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);