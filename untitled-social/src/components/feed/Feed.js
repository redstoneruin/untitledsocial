import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Container, Row, Col, Card, Spinner, Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import PostSummary from '../posts/PostSummary';
import CreatePost from './CreatePost';

import {updateFeed, updateUserFeed} from '../../store/actions/postActions';

import '../../styles/ColorScheme.css';

/**
 * Contain's user's content feed
 */
class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feed: [],
            createPostFormVisible: false,
            isMounted: false
        }
    }

    /**
     * Update feed on component mount
     */
    componentDidMount = () => {
        if(this.props.auth.uid) {
            if(this.props.userFeed) {
                this.props.updateUserFeed();
            } else {
                this.props.updateFeed();
            }
            this.setState({isMounted: true});
        }
    }

    componentWillUnmount = () => {
        this.setState({isMounted: false});
    }


    /**
     * build feed jsx for user from data in store
     */
    assembleFeed = () => {
        var feed;

        // Check that posts exist
        if((!this.props.userFeed && (this.props.posts.feed.length === 0))
            || (this.props.userFeed && !this.props.posts.userFeed)) {
            feed = [
                <Row key={0} className="justify-content-center">
                    <Col md={8}>
                        <Card className="secondary shadow-sm">
                            <Card.Body>
                                <Spinner animation="border" variant="info" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ];
            this.setState({
                feed
            });
            return;
        }

        // determine if feed is for profile or feed page
        
        if(this.props.userFeed) {
            feed = this.props.posts.userFeed;
        } else {
            feed = this.props.posts.feed;
        }

        var feedLength = feed.length;
        
        // return null if empty
        if(feedLength === 0) {
            return null;
        }

        var mapping = [];

        /**
         * Map post summaries to card decks, to make two columns
         */
        for(var i = 0; i < feedLength; i++) {
            // separate into two cols by even/odd index
            mapping.push(
                <Row key={i} className="justify-content-center">
                    <Col md={8}>
                        <PostSummary post={feed[i]} />
                    </Col>
                </Row>
            )
        }

        this.setState({
            feed: mapping
        });
    }

    componentDidUpdate = () => {
        if(!this.state.isMounted) {
            return;
        }

        if(!this.props.userFeed && this.props.posts.feed.length !== this.state.feed.length) this.assembleFeed()
        else if(this.props.userFeed && this.props.posts.userFeed && 
            this.props.posts.userFeed.length !== this.state.feed.length) this.assembleFeed();
    }

    /**
     * Toggle visible state of post form
     */
    toggleCreatePostForm = () => {
        this.setState({
            createPostFormVisible: !this.state.createPostFormVisible
        });
    }

    render() {
        /** buttons visible when create post form is not */
        var headerButtons = !this.state.createPostFormVisible ? (
            <div className="text-right">
                    <Button variant="secondary" className="mr-3">Create Topic</Button>
                    <Button className="primary shadow-sm" onClick={this.toggleCreatePostForm}>Create Post</Button>
            </div>
        ) : null;

        /** form for creating post, visible based on boolean in state */
        var createPostForm = this.state.createPostFormVisible ? (
            <CreatePost toggleCreatePostForm={this.toggleCreatePostForm} />
        ) : null;

        /** to be shown above all posts, guide for users */
        var headerArea = (
            <div>
                <Row className="justify-content-center">
                    <Col md={8} className="mb-4">
                        {headerButtons}
                        {createPostForm}
                    </Col>
                </Row>
            </div>
        );

        // route guarding
        if(!this.props.auth.uid) return <Redirect to="/" />

        return (
            <Container className="pt-4">
                <Row className="pt-4">
                    <Col>
                        {headerArea}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.state.feed ? this.state.feed : (
                            <Row className="justify-content-center">
                                <Col md={8}>
                                    <Card className="shadow-sm secondary">
                                        <Card.Body>
                                            <Card.Title>No Posts!</Card.Title>
                                            <Card.Text>Maybe another time?</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        posts: state.posts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateFeed: () => dispatch(updateFeed()),
        updateUserFeed: () => dispatch(updateUserFeed())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);