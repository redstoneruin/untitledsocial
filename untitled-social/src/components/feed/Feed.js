import React, {Component} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import {connect} from 'react-redux';

import PostSummary from '../posts/PostSummary';

import {updateFeed} from '../../store/actions/postActions';

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
        this.props.updateFeed(this.props.auth.uid);
    }

    /**
     * build feed for user from data in props
     */
    assembleFeed = () => {

        var feed = this.props.posts.feed;
        var feedLength = feed.length;
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
        var feed = this.props.posts.feed && this.props.posts.feed.length > 0 ? this.assembleFeed() : null;

        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        {feed ? feed : (
                            <Row className="justify-content-center">
                                <Col md={6}>
                                    <Card>
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
        updateFeed: (uid) => dispatch(updateFeed(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);