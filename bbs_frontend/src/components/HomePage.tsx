import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
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
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Link to="/login">
              <Button variant="primary">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Register</Button>
            </Link>
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
                <Link to={`/board_${board.name}`}>
                  <Card.Title>{board.name}</Card.Title>
                </Link>
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
