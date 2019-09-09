/**
 * Form for creating new post for a user
 */
import React, {Component} from 'react';
import {Card, Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import {validateTitle, validateDesc, validateContent, getPostType} from '../../shared/validation';
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
                author: this.props.auth.uid,
                time: null,
                content: null,
                topic: null
            },
            files: null,
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

    handleFile = (e) => {
        this.setState({
            files: e.target.files
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
            if(!post.content) post.content = "";
            post.topic = "";

            // get post type based on state
            post.type = getPostType(post, this.state.files);

            // create new post
            this.props.createUserPost(post, this.state.files);

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

            // toggle form visible
            this.props.toggleCreatePostForm();
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
        // validate form components
        var validTitle = validateTitle(this.state.post.title);
        var validDesc = validateDesc(this.state.post.desc);
        var validContent = validateContent(this.state.post.content);

        // combine validated components
        var valid = Object.assign(validTitle, validDesc, validContent);
        var validated = valid.title && valid.desc && valid.content;

        

        this.setState({
            valid,
            validated
        })

    }

    render() {
        return (
            <Card className="shadow-sm secondary">
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
                            <Form.Label>Files</Form.Label>
                            <Form.Label className="text-muted pl-1">(optional)</Form.Label>
                            <Form.Control
                                onChange={this.handleFile}
                                type="file"
                                id="files">
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Link</Form.Label>
                            <Form.Control
                            onChange={this.handleChange}
                            type="text"
                            id="content"
                            isValid={this.state.valid.content}
                            isInvalid={this.state.submitted && !this.state.valid.content}>   
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{this.state.valid.contentMessage}</Form.Control.Feedback>
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
                        <Button variant="danger" className="mr-2" onClick={this.props.toggleCreatePostForm}>Cancel</Button>
                        <Button className="primary-button" onClick={this.handleSubmit}>Post</Button>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createUserPost: (post, files) => dispatch(createUserPost(post, files))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);