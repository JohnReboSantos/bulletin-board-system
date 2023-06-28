import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import localForage from 'localforage';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import {
  useGetThreads,
  useGetBoardName,
  useIsPoster,
  useIsAdminOrMod,
  useGetPosts,
  useGetUsername,
  convertToHumanizedTimestamp,
} from './utils';
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
  const posts = useGetPosts();
  const threads = useGetThreads();
  const isAdminOrMod = useIsAdminOrMod();
  const isPoster = useIsPoster();
  const getBoardName = useGetBoardName();
  const getUsername = useGetUsername();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    board: board.id,
    createdBy: 0,
    locked: false,
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

  const getLastReply = useCallback(
    (threadId: number) => {
      const filteredPosts = posts.filter((post) => post.thread === threadId);
      if (filteredPosts.length > 0) {
        const sortedPosts = filteredPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const latestPost = sortedPosts[0];
        const lastReplyDate = convertToHumanizedTimestamp(latestPost.createdAt);
        const lastReplyName = getUsername(latestPost.createdBy);
        return `Last reply by ${lastReplyName} ${lastReplyDate}`;
      } else {
        return 'No replies';
      }
    },
    [getUsername, posts],
  );

  const handleLockThread = useCallback(
    async (threadId: number) => {
      try {
        await rootStore.threads.patchThread(threadId);
        await rootStore.threads.getThreads();
      } catch (error) {
        console.error('Error locking thread:', error);
      }
    },
    [rootStore.threads],
  );

  const handleCreateThread = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const createThread = async (thread: {
        title: string;
        board: number;
        createdBy: number;
        locked: boolean;
      }) => {
        try {
          await rootStore.threads.postThread(thread);
          await rootStore.threads.getThreads();
        } catch (error) {
          console.error('Error creating thread:', error);
        }
      };
      createThread(formData);
      setFormData({
        title: '',
        board: board.id,
        createdBy: 0,
        locked: false,
      });
    },
    [board.id, formData, rootStore.threads],
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
    const filteredThreads = threads.filter(
      (thread) => getBoardName(thread.board) === board.name,
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
          <small>{getLastReply(thread.id)}</small>
        </div>
        {!thread.locked && isAdminOrMod(rootStore.user.user.id) && (
          <Button
            variant="secondary"
            onClick={() => handleLockThread(thread.id)}
          >
            Lock thread
          </Button>
        )}
      </ListGroup.Item>
    ));
  }, [
    board.name,
    getBoardName,
    getLastReply,
    handleLockThread,
    isAdminOrMod,
    rootStore.user.user.id,
    threads,
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
        {isPoster(rootStore.user.user.id) && (
          <div className="createthread-form">
            <Form onSubmit={handleCreateThread}>
              <Form.Group controlId="createThread">
                <Form.Label>Create thread</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="thread title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      createdBy: rootStore.user.user.id,
                    })
                  }
                />
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
