import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useGetPosts, useGetThreads } from './utils';

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
  const posts = useGetPosts();
  const threads = useGetThreads();
  const isAdmin = useIsAdmin();
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

  const currentUser = useMemo(() => rootStore.user.user, [rootStore.user.user]);

  const getNumberOfThreads = useCallback(
    (boardId: number) =>
      threads.filter((thread) => thread.board === boardId).length,
    [threads],
  );

  const getNumberOfPosts = useCallback(
    (boardId: number) =>
      posts.filter((post) =>
        threads.some(
          (thread) => thread.board === boardId && post.thread === thread.id,
        ),
      ).length,
    [posts, threads],
  );

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
        window.location.reload();
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
            Threads: {getNumberOfThreads(board.id)}
          </ListGroup.Item>{' '}
          <ListGroup.Item>Posts: {getNumberOfPosts(board.id)}</ListGroup.Item>{' '}
        </ListGroup>
      </Tooltip>
    ),
    [getNumberOfPosts, getNumberOfThreads],
  );

  const groupedBoards = useMemo(() => {
    const grouped: {
      [topic: string]: typeof boards;
    } = {};

    boards.forEach((board) => {
      if (!grouped[board.topic]) {
        grouped[board.topic] = [];
      }
      grouped[board.topic].push(board);
    });
    return grouped;
  }, [boards]);

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
        {isAdmin(currentUser.id) &&
          Object.entries(groupedBoards).map(([topic, boards]) => (
            <div key={topic}>
              <h3>{topic}</h3>
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

                  <Button
                    variant="secondary"
                    onClick={() => handleRemoveBoard(board.id)}
                  >
                    Remove board
                  </Button>
                </div>
              ))}
            </div>
          ))}
        {!isAdmin(currentUser.id) &&
          boards.map((board) => (
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
            </div>
          ))}
        {isAdmin(currentUser.id) && (
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
