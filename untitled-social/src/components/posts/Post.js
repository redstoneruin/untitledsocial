import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Card, Spinner} from 'react-bootstrap';

import {getPostByID, getSingleFileURLFromPostId} from '../../store/actions/postActions';
import {getUsernameFromUid} from '../../store/actions/authActions';

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
            files: null
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

    render() {
        var image = this.state.post && this.state.post.type === "image" && this.state.files ? (
            <Card.Img src={this.state.files[0]} />
        ) : null;
        
        var postCard = this.state.post ? (
            <Card className="secondary shadow-sm mt-4 text-left">
                <Card.Header>
                    <Card.Title className="mb-0">{this.state.post.title}</Card.Title>
                </Card.Header>
                { image }
                <Card.Body>
                    {this.state.post.desc}
                </Card.Body>
                <Card.Footer>
                    by {this.state.username} on {this.state.dateString}
                </Card.Footer>
            </Card>
        ) : (
            <Card className="secondary shadow-sm mt-4">
                <Row className="justify-content-center">
                    <Spinner animation="border" variant="info" className="mb-4 mt-4" />                
                </Row>
            </Card>
        );

        return (
            <Container>
                <Row>
                    <Col>
                        {postCard}
                    </Col>
                </Row>
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
        getSingleFileURLFromPostId: (postId) => dispatch(getSingleFileURLFromPostId(postId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);