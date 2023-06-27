import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import localForage from 'localforage';
import { observer } from 'mobx-react-lite';
import { useIsAdmin } from './utils';
import {
  Button,
  Card,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Form,
  Navbar,
} from 'react-bootstrap';
import '../App.css';
import { useStore } from '../stores/RootStore';

const HomePage: React.FC<{
  boards: {
    id: number;
    name: string;
    topic: string;
    description: string;
    createdAt: string;
  }[];
}> = ({ boards }) => {
  interface Board {
    id: number;
    name: string;
    topic: string;
    description: string;
    createdAt: string;
  }
  const rootStore = useStore();
  const IsAdmin = useIsAdmin();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUser = useCallback(async () => {
    try {
      await rootStore.user.getUser();
      rootStore.user.user.id ? setIsLoggedIn(true) : setIsLoggedIn(false);
    } catch (error) {
      console.error('Error getting user:', error);
      setIsLoggedIn(false);
    }
  }, [rootStore.user]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleLogout = useCallback(() => {
    localForage
      .removeItem('authToken')
      .then(() => {
        alert('Logged out successfully');
        setIsLoggedIn(false);
      })
      .catch((error) => {
        alert('Logout error:' + error);
      });
  }, []);

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
          {isLoggedIn ? (
            <Navbar.Collapse className="justify-content-end">
              <Link to="/">
                <Button variant="primary" onClick={handleLogout}>
                  Log out
                </Button>
              </Link>
            </Navbar.Collapse>
          ) : (
            <Navbar.Collapse className="justify-content-end">
              <Link to="/login">
                <Button variant="primary">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </Navbar.Collapse>
          )}
        </Navbar.Collapse>
      </Navbar>

      <div className="board-list">
        {boards.map((board) => (
          <React.Fragment key={board.id}>
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
            {IsAdmin(rootStore.user.user.id) && (
              <Button variant="secondary">Remove board</Button>
            )}
          </React.Fragment>
        ))}
        {IsAdmin(rootStore.user.user.id) && (
          <div className="createboard-form">
            <Form>
              <Form.Group controlId="formBoardName">
                <Form.Label>Board name</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>
              <Form.Group controlId="formBoardTopic">
                <Form.Label>Board topic</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>
              <Form.Group controlId="formBoardDescription">
                <Form.Label>Board description</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create board
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(HomePage);
