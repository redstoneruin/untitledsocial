import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Card} from 'react-bootstrap';
import '../../styles/ColorScheme.css'

/**
 * Reduced form of a post
 */
class PostSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
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
            <Card style={{cursor: "pointer"}} onClick={this.handleClick} className="shadow-sm secondary mb-4 selection-hover-fade">
                <Card.Body className="text-left">
                    <Card.Title>{this.props.post.title}</Card.Title>
                    <Card.Text>{this.props.post.desc}</Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default PostSummary;