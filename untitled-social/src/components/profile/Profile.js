import React, {Component} from 'react';
import {Container, Card, Spinner, Row, Col} from 'react-bootstrap';
import {connect} from 'react-redux';

import {getProfileByUsername} from '../../store/actions/authActions';

/**
 * User profile component
 */
class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: props.match.params.id
        }
    }

    /**
     * Get profile data on component mount
     */
    componentDidMount = () => {
        this.props.getProfileByUsername(this.props.match.params.id);
    }

    /**
     * Update profile if route changes
     */
    componentDidUpdate = () => {
        if(this.props.match.params.id !== this.state.route) {
            this.setState({
                route: this.props.match.params.id
            }, () => {
                // after setting state, update profile data
                this.props.getProfileByUsername(this.state.route);
            })
        }
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
                        <Card>
                            <Card.Body className="text-left">
                                <Card.Title>{this.props.loadedProfile.username}</Card.Title>
                                <Card.Text>{this.props.loadedProfile.bio ? this.props.loadedProfile.bio : (
                                    "User has no bio." 
                                )}</Card.Text>
                            </Card.Body>
                        </Card>
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