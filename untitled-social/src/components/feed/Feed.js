import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Container, Row, Col, Card} from 'react-bootstrap';
import {connect} from 'react-redux';

import PostSummary from '../posts/PostSummary';

import {updateFeed, updateUserFeed} from '../../store/actions/postActions';

import '../../styles/ColorScheme.css';

/**
 * Contain's user's content feed
 */
class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            feed: null
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
        }
    }

    /**
     * build feed jsx for user from data in store
     */
    assembleFeed = () => {

        // Check that posts exist
        if((!this.props.userFeed && !this.props.posts.feed)
            || (this.props.userFeed && !this.props.posts.userFeed)) {
            return null;
        }

        // determine if feed is for profile or feed page
        var feed;
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

        return mapping;
    }

    render() {
        var feed = this.assembleFeed();

        // route guarding
        if(!this.props.auth.uid) return <Redirect to="/" />

        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        {feed ? feed : (
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