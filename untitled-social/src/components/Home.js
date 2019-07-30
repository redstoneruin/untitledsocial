import React, {Component} from 'react';
import Button from 'react-bootstrap/Button';

import {connect} from 'react-redux';
import {postTestData} from '../store/actions/testActions';

/**
 * Component for Untitled Social home page
 */
class Home extends Component {

    /**
     * Test function for accessing database
     */
    handleClick = (e) => {
        e.preventDefault();
        this.props.postTestData({name: 'ryan', bio: 'test'});
    }

    render() {
        return(
            <div>
                <p>Home page</p>
                <Button onClick={this.handleClick}>Test</Button>
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        postTestData: (data) => dispatch(postTestData(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);