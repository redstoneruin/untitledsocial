import React, {Component} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';

import PostSummary from '../posts/PostSummary';

/**
 * Contain's user's content feed
 */
class Feed extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null
        }
    }

    /**
     * build feed for user from data in props
     */
    assembleFeed = () => {
        var testpost = {
            title: "Test post",
            desc: "The description of this test post"
        };

        var posts = [testpost, testpost, testpost, testpost, testpost];
        var postsLength = posts.length;
        var temp = null;
        var mapping = [];

        /**
         * Map post summaries to card decks, to make two columns
         */
        for(var i = 0; i < postsLength; i++) {
            // separate into two cols by even/odd index
            if(i % 2 === 0) {
                temp=posts[i];

                // if last post, put in separate row
                if(i === postsLength-1) {
                    mapping.push(
                        <Row key={i}>
                            <Col md={6}>
                                <PostSummary post={temp} />
                            </Col>
                        </Row>
                    );
                }
            } else {
                mapping.push(
                    <Row key={i}>
                        <Col md={6}><PostSummary post={temp} /></Col>
                        <Col md={6}><PostSummary post={posts[i]} /></Col>
                    </Row>
                );
            }
        }

        return mapping;
    }

    render() {
        
        var feed = this.assembleFeed();

        return (
            <Container className="pt-4">
                <Row>
                    <Col>
                        {feed ? feed : (
                            <Row>
                                <Col md={6}>
                                    <Card>
                                        <Card.Title>No Posts!</Card.Title>
                                        <Card.Text>Maybe another time?</Card.Text>
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

export default Feed;