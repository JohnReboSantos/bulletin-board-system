import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Card,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Navbar,
} from 'react-bootstrap';
import '../App.css';

const HomePage: React.FC<{
  boards: {
    id: number;
    name: string;
    topic: string;
    description: string;
    created_at: string;
  }[];
}> = ({ boards }) => {
  interface Board {
    id: number;
    name: string;
    topic: string;
    description: string;
    created_at: string;
  }

  console.log('boards from homepage', boards);

  const renderTooltip = useCallback(
    (board: Board) => (
      <Tooltip>
        <Card.Title>{board.name}</Card.Title>
        <Card.Text>{board.description}</Card.Text>
        <ListGroup>
          <ListGroup.Item>
            Threads: {/* implement no. threads */}
          </ListGroup.Item>{' '}
          <ListGroup.Item>Posts: {/* implement no. of posts */}</ListGroup.Item>{' '}
        </ListGroup>
      </Tooltip>
    ),
    [],
  );

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Your Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary">Log in</Button>
            <Button variant="primary">Register</Button>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>

      <div className="board-list">
        {boards.map((board) => (
          <OverlayTrigger
            key={board.id}
            placement="bottom"
            overlay={renderTooltip(board)}
          >
            <Card style={{ width: '18rem', margin: '10px' }}>
              <Card.Body>
                <Card.Title>{board.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {board.topic}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </OverlayTrigger>
        ))}
      </div>
    </div>
  );
};

export default observer(HomePage);
