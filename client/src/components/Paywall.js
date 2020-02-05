import React, { Component } from 'react';
import { Modal, Row, Col, Grid, Jumbotron, ProgressBar } from 'react-bootstrap';
import Donate from './Donate';

class Paywall extends Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render() {
    return <Modal animation={false} show={this.props.open} onHide={this.props.onHide}>
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <Grid>
          <div className="modal-centered">
            <Row>
              <Col xs={12}>
                <Donate />

                <a href="#" onClick={this.props.onHide}>Закрыть</a>
              </Col>
            </Row>
          </div>

        </Grid>
      </Modal.Body>
    </Modal>
  }
}

export default Paywall;
