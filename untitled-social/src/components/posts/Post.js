import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col, Card, Spinner} from 'react-bootstrap';

import {getPostByID} from '../../store/actions/postActions';

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
                console.log(post);
            });
    }

    render() {
        
        var postCard = this.state.post ? (
            <Card className="secondary shadow-sm mt-4 text-left">
                <Card.Header>
                    <Card.Title className="mb-0">{this.state.post.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                    {this.state.post.desc}
                </Card.Body>
                <Card.Footer>
                    Test
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
        getPostByID: (id) => dispatch(getPostByID(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);