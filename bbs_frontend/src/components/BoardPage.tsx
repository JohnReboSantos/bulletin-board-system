import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import localForage from 'localforage';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import {
  useGetThreads,
  useGetPosts,
  useGetUsername,
  convertToHumanizedTimestamp,
  getSortedThreads,
  useIsBanned,
  useGetUserRole,
} from './utils';
import {
  Card,
  ListGroup,
  Pagination,
  Form,
  Navbar,
  Button,
  Image,
} from 'react-bootstrap';
import './NavBar.css';

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
  const isBanned = useIsBanned();
  const getUserRole = useGetUserRole();
  const posts = useGetPosts();
  const threads = useGetThreads();
  const getUsername = useGetUsername();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const currentUser = useMemo(() => rootStore.user.user, [rootStore.user.user]);

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

  const handleUpdateThread = useCallback(
    async (threadId: number, threadLocked: boolean, threadSticky: boolean) => {
      try {
        await rootStore.threads.patchThread(
          threadId,
          threadLocked,
          threadSticky,
        );
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

  const threadsPerPage = 20;
  const totalPages = useMemo(() => {
    const filteredThreads = threads.filter(
      (thread) => thread.board === board.id,
    );
    const pages = Math.ceil(filteredThreads.length / threadsPerPage);
    return pages;
  }, [board.id, threads]);

  const renderThreads = useCallback(() => {
    const stickyThreads = threads.filter(
      (thread) => thread.board === board.id && thread.sticky,
    );
    const nonStickyThreads = threads.filter(
      (thread) => thread.board === board.id && !thread.sticky,
    );
    const sortedStickyThreads = getSortedThreads(stickyThreads, posts);
    const sortedNonStickyThreads = getSortedThreads(nonStickyThreads, posts);
    const sortedThreads = [...sortedStickyThreads, ...sortedNonStickyThreads];
    const indexOfLastPost = currentPage * threadsPerPage;
    const indexOfFirstPost = indexOfLastPost - threadsPerPage;
    const currentThreads = sortedThreads.slice(
      indexOfFirstPost,
      indexOfLastPost,
    );
    return currentThreads.map((thread) => (
      <ListGroup.Item key={thread.id}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/board_${board.name}/thread_${thread.title}`}>
            <div>{thread.title}</div>
          </Link>
          <div>
            {thread.locked && <span className="text-danger">Locked</span>}
            <br />
            {thread.sticky && <span className="text-danger">Sticky</span>}
          </div>
        </div>
        <div className="mt-2">
          <small>{getLastReply(thread.id)}</small>
        </div>
        {isLoggedIn && !thread.locked && (getUserRole(currentUser.id) === ('moderator' || 'admin')) && (
          <Button
            variant="secondary"
            onClick={() => handleUpdateThread(thread.id, true, thread.sticky)}
          >
            Lock
          </Button>
        )}
        {isLoggedIn && thread.locked && (getUserRole(currentUser.id) === ('moderator' || 'admin')) && (
          <Button
            variant="secondary"
            onClick={() => handleUpdateThread(thread.id, false, thread.sticky)}
          >
            Unlock
          </Button>
        )}
        {isLoggedIn && !thread.sticky && (getUserRole(currentUser.id) === ('moderator' || 'admin')) && (
          <Button
            variant="secondary"
            onClick={() => handleUpdateThread(thread.id, thread.locked, true)}
          >
            Stickify
          </Button>
        )}
        {isLoggedIn && thread.sticky && (getUserRole(currentUser.id) === ('moderator' || 'admin')) && (
          <Button
            variant="secondary"
            onClick={() => handleUpdateThread(thread.id, thread.locked, false)}
          >
            Unstickify
          </Button>
        )}
      </ListGroup.Item>
    ));
  }, [board.id, board.name, currentPage, currentUser.id, getLastReply, getUserRole, handleUpdateThread, isLoggedIn, posts, threads]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {isLoggedIn ? (
            <Navbar.Collapse className="justify-content-end">
              <div className="d-flex align-items-center">
                <Image
                  src={`${process.env.REACT_APP_BASE_URL}${currentUser.avatar}`}
                  roundedCircle
                  className="avatar"
                />
                <div className="ml-2">Hello {currentUser.username}!</div>
                <Link to={`/user_${currentUser.id}`} className="ml-2">
                  <Button variant="primary">Profile</Button>
                </Link>
                <Button
                  variant="primary"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  Log out
                </Button>
              </div>
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
          <Pagination className="mt-3">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <Pagination.Item
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Item>
              ),
            )}
          </Pagination>
        </Card>
        {isLoggedIn && !isBanned(currentUser.id) && (
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
                      createdBy: currentUser.id,
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
      </div>
    </div>
  );
};

export default observer(BoardPage);
