import React, {Component} from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

import '../../styles/ColorScheme.css';

class Topic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topic: null
        }
    }

    /**
     * Get topic data on component mount
     */
    componentDidMount = () => {
        var topic = this.props.match.params.id;

        this.setState({
            topic
        });


    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Col xs={10}>
                        <Card className="mt-4 secondary shadow">
                            <Card.Title className="mt-4">{this.state.topic}</Card.Title>
                            <Card.Body>
                                Description
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Topic;