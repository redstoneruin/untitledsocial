import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import {connect} from 'react-redux';

import {getUsernameFromUid} from '../../store/actions/authActions';

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
            dateString: null
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
        })
    }

    /**
     * Handle click and redirect to 
     */
    handleClick = () => {
        this.setState({redirect: true});
    }

    render() {
        // redirect to this post
        if(this.state.redirect) return <Redirect to={"/post/" + this.props.postId} />

        return(
            <Card style={{cursor: "pointer"}} onClick={this.handleClick} className="shadow-sm secondary mb-4 selection-hover-fade text-left">
                <Card.Body className="text-left">
                    <Card.Title>{this.props.post.title}</Card.Title>
                    <Card.Text>{this.props.post.desc}</Card.Text>
                </Card.Body>
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
        getUsernameFromUid: (uid) => dispatch(getUsernameFromUid(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostSummary);