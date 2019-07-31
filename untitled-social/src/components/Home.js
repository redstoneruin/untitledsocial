import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Card, CardDeck, Row, Col, Button} from 'react-bootstrap';

import {connect} from 'react-redux';

import '../styles/ColorScheme.css';

/**
 * Component for Untitled Social home page
 */
class Home extends Component {

    render() {
        return(
            <Container>
                <Row className="justify-content-center text-left">
                    <Col>
                        <Card className="mt-4 shadow secondary">  
                            <Card.Body>
                                <Card.Title as="h2" className="text-center pb-4 pt-2" style={{fontWeight: "750"}}>Untitled Social</Card.Title>

                                <CardDeck>
                                    <Card className="tertiary shadow-sm">
                                        <Card.Body>
                                            <Card.Title className="pb-2">Find content you love</Card.Title>
                                            <Card.Text>
                                                Untitled Social allows you to subscribe to topics you enjoy, 
                                                so your feed is always full.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Card className="shadow-sm" style={{backgroundColor: "#849aa7", borderColor: "#849aa7", color: "white"}}>
                                        <Card.Body>
                                            <Card.Title className="pb-2">Connect with friends</Card.Title>
                                            <Card.Text>
                                                Find friends you know, and new people with similar interests.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Card className="shadow-sm" style={{backgroundColor: "#c5e0ee", borderColor: "#c5e0ee"}}>
                                        <Card.Body>
                                            <Card.Title className="pb-2">Post yourself!</Card.Title>
                                            <Card.Text>
                                                Post away in whatever form suits you best. We're 
                                                here to host your content.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </CardDeck>
                                <div className="text-right">
                                    <Link to="/signup"><Button className="primary-button mt-3 mr-2" onClick={this.handleClick}>Sign Up</Button></Link>
                                    <Link to="/login"><Button className="primary-button mt-3" onClick={this.handleClick}>Login</Button></Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Home);