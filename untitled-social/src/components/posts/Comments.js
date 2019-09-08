import React, {Component} from 'react';

import {connect} from 'react-redux';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';

import {getComments, addUserComment} from '../../store/actions/postActions';
import {getUsernameFromUid} from '../../store/actions/authActions';

/**
 * Comments, takes prop of postId
 */
class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            comments: null,
            commentFeed: null
        }
        this.getCommentData = this.getCommentData.bind(this);
    }

    componentDidMount = () => {
        this.getCommentData();
        
    }

    /**
     * Get comment array of objects
     */
    async getCommentData() {
        try {
            this.props.getComments(this.props.postId)
                .then(comments => {
                    if(comments) {
                        comments.forEach(comment => {
                            this.tagComments(comments)
                                .then((comments) => {
                                    /** tag comments with username info */
                                    this.setState({
                                        comments
                                    });
                                    this.buildFeed(comments);
                                });
                        });
                    }
                    this.buildFeed(comments);
                    
                });
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Tag array of comment object with usernames to display
     * @param {array} comments 
     */
    async tagComments(comments) {
        return new Promise((resolve, reject) => {
            var commentCount = 0;

            /** 
             * loop through comments, asyncronously find usernames
             * count comments until matches array length
             */
            comments.forEach((comment, index) => {
                this.props.getUsernameFromUid(comment.uid)
                    .then(username => {
                        comments[index].username = username;

                        /** increment commentCount, check all usernames have been found */
                        commentCount++;
                        if(commentCount === comments.length) {
                            return resolve(comments);
                        }
                    });
            });
        });
    }

    /**
     * Build feed into displayable jsx array
     */
    buildFeed = (comments) => {

        /**
         * Make jsx array from comment data
         */
        var commentFeed = [];

        
        if(!!comments) {
            for(var i = 0; i < comments.length; i++) {
                var comment = comments[i];

                /**
                 * Format for comments
                 */
                commentFeed.push(
                    <Row key={comment.id} className="pb-4">
                        <Col>
                            <Card className="secondary text-left">
                                <Card.Body>{comment.comment}</Card.Body>
                                <Card.Footer className="text-right">by {comment.username}</Card.Footer>
                            </Card>
                        </Col>
                    </Row >
                );
            }

        } else {
            commentFeed = (
                <Row>
                    <Col>
                        <Card className="secondary text-left">
                            <Card.Body>No posts.</Card.Body>
                        </Card>
                    </Col>
                </Row>
            );
        }

        this.setState({
            commentFeed
        });
    }

    /**
     * Handle changes to input field
     */
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    /**
     * Handler for comment posting
     */
    postComment = (e) => {
        e.preventDefault();

        this.props.addUserComment(this.props.postId, this.state.comment);
        this.getCommentData();
    }

    render() {

        /**
         * Displays add comment form, and feed for comments
         */
        return (
            <div>
                <Row className="mt-5 mb-3">
                    <Col xs={12} md={10} xl={11}>
                        <Form onSubmit={this.postComment}>
                            <Form.Group className="text-left">
                                <Form.Control
                                    required
                                    onChange={this.handleChange}
                                    type="text"
                                    id="comment"
                                    placeholder="Comment">
                                </Form.Control>

                            </Form.Group>
                        </Form>
                    </Col>

                    <Col xs={2} xl={1} className="text-left">
                        <Button onClick={this.postComment}>Post</Button>
                    </Col>
                </Row>
                {this.state.commentFeed}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getComments: (postId) => dispatch(getComments(postId)),
        addUserComment: (postId, comment) => dispatch(addUserComment(postId, comment)),
        getUsernameFromUid: (uid) => dispatch(getUsernameFromUid(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);