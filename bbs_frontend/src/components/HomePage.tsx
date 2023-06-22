import React, { useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import {
  Button,
  Card,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Navbar,
} from 'react-bootstrap';
import '../App.css';

const HomePage = () => {
  const rootStore = useStore();

  const getBoards = useCallback(async () => {
    try {
      await rootStore.boards.getBoards();
    } catch (error) {
      console.error('Error getting boards:', error);
    }
  }, [rootStore.boards]);

  useEffect(() => {
    getBoards();
  }, [getBoards]);

  const memoizedBoards = useMemo(
    () => rootStore.boards.boards,
    [rootStore.boards.boards],
  );

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
        {memoizedBoards.map((board) => (
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
