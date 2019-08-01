/**
 * Form for creating new post for a user
 */
import React, {Component} from 'react';
import {Row, Col, Card, Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import {validateTitle, validateDesc} from '../../shared/validation';
import {createUserPost} from '../../store/actions/postActions';

class CreatePost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submitted: false,
            post: {
                type: null,
                title: null,
                desc: null,
                author: this.props.profile.username,
                time: null,
                content: null
            },
            valid: {
                title: false,
                titleMessage: null,
                desc: false,
                descMessage: false
            },
            validated: false
        }
    }

    /**
     * Handle state changes on form update
     */
    handleChange = (e) => {
        // Combine field into post, update state
        var post = Object.assign(this.state.post, {[e.target.id]: e.target.value});
        this.setState({
            post
        }, this.validateState());
    }

    /**
     * Handle create post form submission
     */
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.state.validated) {
            var post = this.state.post;
            //
            // TODO: Dummy data, separate into function
            //
            post.time = new Date();
            post.content = "";
            post.type = "text";

            // create new post
            // this.props.createUserPost(post);

            //
            // Reset form to original state
            //
            post = {
                type: null,
                title: null,
                desc: null,
                author: this.props.profile.username,
                time: null,
                content: null
            }
            this.setState({
                post,
                submitted: false
            }, this.validateState());
        } else {
            this.setState({
                submitted: true
            })
        }
    }

    /**
     * Handle validation for items in state
     */
    validateState = () => {
        var validTitle = validateTitle(this.state.post.title);
        var validDesc = validateDesc(this.state.post.desc);

        var valid = Object.assign(validTitle, validDesc);
        var validated = valid.title && valid.desc;

        this.setState({
            valid,
            validated
        })

    }

    render() {
        return (
            <Row className="mt-4">
                <Col>
                    <Card className="shadow secondary">
                        <Card.Body className="text-left">
                            <Card.Title className="text-center">Create Post</Card.Title>
                            <Form onSubmit={this.handleSubmit} noValidate validated={this.state.validated}>
                                    <Form.Group>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            type="text"
                                            id="title"
                                            defaultValue={this.state.title}
                                            isValid={this.state.valid.title}
                                            isInvalid={this.state.submitted && !this.state.valid.title}>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{this.state.valid.titleMessage}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            required
                                            onChange={this.handleChange}
                                            as="textarea"
                                            rows="3"
                                            id="desc"
                                            defaultValue={this.state.desc}
                                            isValid={this.state.valid.desc}
                                            isInvalid={this.state.submitted && !this.state.valid.desc}>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">{this.state.valid.descMessage}</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                                <div className="text-right">
                                    <Button className="primary-button" onClick={this.handleSubmit}>Post</Button>
                                </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createUserPost: (post) => dispatch(createUserPost(post))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);