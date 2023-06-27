import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import localForage from 'localforage';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import { useGetBoardName } from './utils';
import { useIsAdminOrMod } from './utils';
import {
  Card,
  ListGroup,
  Pagination,
  Form,
  Navbar,
  Button,
} from 'react-bootstrap';

const BoardPage: React.FC<{
  board: {
    id: number;
    name: string;
    topic: string;
    description: string;
    createdAt: string;
  };
}> = ({ board }) => {
  const rootStore = useStore();
  const isAdminOrMod = useIsAdminOrMod();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getBoardName = useGetBoardName();

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

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
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

  const renderThreads = useCallback(() => {
    const filteredThreads = memoizedThreads.filter(
      (thread) => getBoardName(parseInt(thread.board)) === board.name,
    );
    return filteredThreads.map((thread) => (
      <ListGroup.Item key={thread.id}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/board_${board.name}/thread_${thread.title}`}>
            <div>{thread.title}</div>
          </Link>
          <div>
            {thread.locked && <span className="text-danger">Locked</span>}
          </div>
        </div>
        <div className="mt-2">
          <small>
            Last reply: {/* last reply */} by {/* last replier name*/}
          </small>
        </div>
        {isAdminOrMod(rootStore.user.user.id) && (
          <Button variant="secondary">Lock thread</Button>
        )}
      </ListGroup.Item>
    ));
  }, [
    board.name,
    getBoardName,
    isAdminOrMod,
    memoizedThreads,
    rootStore.user.user.id,
  ]);

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
      <div className="board-index-page">
        <h2>{board.name}</h2>
        <Card>
          <ListGroup variant="flush">{renderThreads()}</ListGroup>
        </Card>
        {isLoggedIn && (
          <div className="createthread-form">
            <Form>
              <Form.Group controlId="createThread">
                <Form.Label>Create thread</Form.Label>
                <Form.Control as="textarea" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create
              </Button>
            </Form>
          </div>
        )}
        <Pagination className="mt-3">
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    </div>
  );
};

export default observer(BoardPage);
