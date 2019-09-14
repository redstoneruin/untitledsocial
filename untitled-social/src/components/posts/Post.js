import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Container, Row, Col, Card, Spinner, Button} from 'react-bootstrap';

import {getPostByID, getSingleFileURLFromPostId, deletePost} from '../../store/actions/postActions';
import {getUsernameFromUid} from '../../store/actions/authActions';
import {getValidLink} from '../../shared/validation';

import Comments from './Comments';

import '../../styles/ColorScheme.css';

/**
 * Expanded form of a post
 */
class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: null,
            username: null,
            dateString: null,
            files: null,
            redirect: null
        }
    }

    componentDidMount = () => {
        this.getStateData();
    }

    getStateData = () => {
        // get post with given id
        this.props.getPostByID(this.props.match.params.id)
            .then(post => {
                this.setState({
                    post
                });

                if(post === null) {
                    return;
                }

                // get username from uid
                this.props.getUsernameFromUid(post.author)
                    .then(username => {
                        this.setState({
                            username
                        });
                    });

                // get and reformat date                    
                var date = new Date(post.time.seconds * 1000);
                var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                this.setState({
                    dateString
                });

                // Get single image url
                if(post.type === "image") {
                    this.props.getSingleFileURLFromPostId(post.id)
                        .then(url => {
                            var files = [url];
                            this.setState({
                                files
                            });
                        });
                }
            });

    }

    /** handle call to delete post from database */
    handleDelete = () => {
        if(this.state.post && this.state.post.author === this.props.auth.uid) {
            /* dispatch action delete post */
            this.props.deletePost(this.state.post.id)
                .then(deleted => {
                    if(deleted) {
                        this.setState({
                            redirect: '/feed'
                        })
                    }
                });
        }
    }

    render() {
        if(this.state.redirect) {
            return (
                <Redirect to={this.state.redirect} />
            );
        }

        var image = this.state.post && this.state.post.type === "image" && this.state.files ? (
            <Card.Img className="mt-3 shadow" src={this.state.files[0]} />
        ) : null;

        var deleteButton = this.state.post && this.state.post.author === this.props.auth.uid ? (
            <Row className="justify-content-right text-right">
                <Col>
                    <Button variant="danger" onClick={this.handleDelete} className="mt-3 shadow-sm">Delete</Button>
                </Col>
            </Row>
        ) : null;
        
        var link = this.state.post && this.state.post.content ? (
            // link to display if exists
            <Card variant="flush" className="secondary-accent shadow-sm mb-4 mt-1">
                <Card.Body>
                    <a rel="noopener noreferrer" target = "_blank" href={getValidLink(this.state.post.content)}>{this.state.post.content}</a>
                </Card.Body>
            </Card>
        ) : null;


        var postCard = this.state.post ? (
            <Card className="secondary shadow-sm mt-4 text-left">
                <Card.Header>
                    <Card.Title className="mb-0">{this.state.post.title}</Card.Title>
                </Card.Header>

                { image }
                
                <Card.Body>
                    {link}
                    <Row>
                        <Col>
                            {this.state.post.desc}
                        </Col>
                    </Row> 
                    
                    {deleteButton}

                </Card.Body>
                <Card.Footer>
                by <Link to={"/user/" + this.state.username}>{this.state.username}</Link> on {this.state.dateString}
                </Card.Footer>
            </Card>
        ) : (
            <Card className="secondary shadow-sm mt-4">
                <Row className="justify-content-center">
                    <Spinner animation="border" variant="info" className="mb-4 mt-4" />                
                </Row>
            </Card>
        );

        var comments = this.state.post ? (
            <Comments postId={this.state.post.id} />
        ) : null;

        return (
            <Container>
                <Row>
                    <Col>
                        {postCard}
                    </Col>
                </Row>
                {comments}
            </Container>
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
        getPostByID: (id) => dispatch(getPostByID(id)),
        getUsernameFromUid: (uid) => dispatch(getUsernameFromUid(uid)),
        getSingleFileURLFromPostId: (postId) => dispatch(getSingleFileURLFromPostId(postId)),
        deletePost: (id) => dispatch(deletePost(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);