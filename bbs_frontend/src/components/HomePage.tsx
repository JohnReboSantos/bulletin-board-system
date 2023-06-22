import React from 'react';
import { Button, Card, ListGroup, OverlayTrigger, Tooltip, Navbar } from 'react-bootstrap';
import '../App.css';

const HomePage = () => {
  const boards = [
    {
      id: 1,
      name: 'Board 1',
      description: 'This is the description for Board 1',
      threads: 10,
      posts: 50,
    },
    {
      id: 2,
      name: 'Board 2',
      description: 'This is the description for Board 2',
      threads: 15,
      posts: 75,
    },
    // Add more boards as needed
  ];

  const renderTooltip = (board: any) => (
    <Tooltip>
      <Card.Title>{board.name}</Card.Title>
      <Card.Text>{board.description}</Card.Text>
      <ListGroup>
        <ListGroup.Item>Threads: {board.threads}</ListGroup.Item>
        <ListGroup.Item>Posts: {board.posts}</ListGroup.Item>
      </ListGroup>
    </Tooltip>
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
              <Card.Subtitle className="mb-2 text-muted">Board</Card.Subtitle>
            </Card.Body>
          </Card>
        </OverlayTrigger>
      ))}
      </div>
    </div>
  );
};

export default HomePage;
