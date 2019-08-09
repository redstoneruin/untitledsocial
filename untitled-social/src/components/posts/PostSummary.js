import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Card, Spinner, Row} from 'react-bootstrap';
import {connect} from 'react-redux';

import {getUsernameFromUid} from '../../store/actions/authActions';
import {getSingleFileURLFromPostId} from '../../store/actions/postActions';

import '../../styles/ColorScheme.css'

/**
 * Reduced form of a post
 */
class PostSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            username: null,
            dateString: null,
            files: null
        }
    }

    /**
     * Update state info on component mount if user logged in
     */
    componentDidMount = () => {
        if(this.props.auth.uid) {
            this.getStateData();
        }
    }

    /**
     * Get username of poster and date string
     */
    getStateData = () => {
        // get username
        this.props.getUsernameFromUid(this.props.post.author)
        .then(username => this.setState({
            username
        }))
        // catch rejections
        .catch(err => {
            console.log(err);
        });

        // compile date string
        var date = new Date(this.props.post.time.seconds * 1000);
        var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        // set date in state
        this.setState({
            dateString
        });

        // get files if necessary
        if(this.props.post.type === "image") {
            // get image download url
            this.props.getSingleFileURLFromPostId(this.props.post.id)
                .then(url => {
                    // attach to files, keep in array format
                    var files = [url];
                    this.setState({
                        files
                    });
                })
        }
    }

    /**
     * Handle click and redirect to 
     */
    handleClick = () => {
        this.setState({redirect: true});
    }

    render() {
        var image = this.props.post.type === "image"  && this.state.files ? (
            <Card.Img src={this.state.files[0]} />
        ) : null;

        var filesLoadingSpinner = (this.props.post.type === "image" || this.props.post.type === "video")
        && !this.state.files ? (
            <Row className="justify-content-center">
                <Spinner animation="border" variant="info" />
            </Row>
        ) : null
        // redirect to this post
        if(this.state.redirect) return <Redirect to={"/post/" + this.props.postId} />

        return(
            <Card style={{cursor: "pointer"}} onClick={this.handleClick} className="shadow-sm secondary mb-4 selection-hover-fade text-left">
                
                <Card.Body className="text-left">
                    <Card.Title>{this.props.post.title}</Card.Title>
                    <Card.Text>{this.props.post.desc}</Card.Text>
                    {filesLoadingSpinner}
                </Card.Body>
                {image}
                <Card.Footer className="text-muted">
                    {"by " + this.state.username + " on " + this.state.dateString}
                </Card.Footer>
            </Card>
        )
    }
}

export const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        getUsernameFromUid: (uid) => dispatch(getUsernameFromUid(uid)),
        getSingleFileURLFromPostId: (postId) => dispatch(getSingleFileURLFromPostId(postId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSummary);