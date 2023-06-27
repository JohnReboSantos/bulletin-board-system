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
  const rootStore = useStore();
  const IsAdmin = useIsAdmin();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    description: '',
  });

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

  const handleCreateBoard = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const createBoard = async (board: {
        name: string;
        topic: string;
        description: string;
      }) => {
        try {
          await rootStore.boards.postBoard(board);
          await rootStore.boards.getBoards();
        } catch (error) {
          console.error('Error creating board:', error);
        }
      };
      createBoard(formData);
    },
    [formData, rootStore.boards],
  );

  const handleRemoveBoard = useCallback(
    async (boardId: number) => {
      try {
        await rootStore.boards.deleteBoard(boardId);
        await rootStore.boards.getBoards();
      } catch (error) {
        console.error('Error removing board:', error);
      }
    },
    [rootStore.boards],
  );

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
    (board: {
      id: number;
      name: string;
      topic: string;
      description: string;
      createdAt: string;
    }) => (
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
          <div key={board.id}>
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
              <Button
                variant="secondary"
                onClick={() => handleRemoveBoard(board.id)}
              >
                Remove board
              </Button>
            )}
          </div>
        ))}
        {IsAdmin(rootStore.user.user.id) && (
          <div className="createboard-form">
            <Form onSubmit={handleCreateBoard}>
              <Form.Group controlId="formBoardName">
                <Form.Label>Board name</Form.Label>
                <Form.Control
                  as="textarea"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBoardTopic">
                <Form.Label>Board topic</Form.Label>
                <Form.Control
                  as="textarea"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="formBoardDescription">
                <Form.Label>Board description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
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
