import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import localForage from 'localforage';
import {
  Card,
  ListGroup,
  Pagination,
  Form,
  Button,
  Navbar,
} from 'react-bootstrap';
import {
  useGetPosts,
  useGetBoardName,
  useGetUsername,
  convertToHumanizedTimestamp,
} from './utils';

const ThreadPage: React.FC<{
  thread: {
    id: number;
    title: string;
    board: number;
    createdBy: number;
    createdAt: string;
    locked: boolean;
    sticky: boolean;
  };
}> = ({ thread }) => {
  const rootStore = useStore();
  const posts = useGetPosts();
  const getBoardName = useGetBoardName();
  const getUsername = useGetUsername();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    thread: thread.id,
    message: '',
    createdBy: 0,
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

  const handlePostReply = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const postReply = async (post: {
        thread: number;
        message: string;
        createdBy: number;
      }) => {
        try {
          await rootStore.posts.postPost(post);
          await rootStore.posts.getPosts();
        } catch (error) {
          console.error('Error posting reply:', error);
        }
      };
      postReply(formData);
      setFormData({
        thread: thread.id,
        message: '',
        createdBy: 0,
      });
    },
    [formData, rootStore.posts, thread.id],
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

  const renderPosts = useCallback(() => {
    const filteredPosts = posts.filter((post) => post.thread === thread.id);

    const sortedPosts = filteredPosts.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return sortedPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/user_${post.createdBy}`}>
            <div>{getUsername(post.createdBy)}</div>
          </Link>
          <div>
            <small>{convertToHumanizedTimestamp(post.createdAt)}</small>
          </div>
        </div>
        <div className="mt-2">{post.message}</div>
      </ListGroup.Item>
    ));
  }, [getUsername, posts, thread.id]);

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
      <div className="thread-index-page">
        <h2>{thread.title}</h2>
        <h4>Board: {getBoardName(thread.board)}</h4>
        <Card>
          <ListGroup variant="flush">{renderPosts()}</ListGroup>
        </Card>
        {isLoggedIn && !thread.locked && (
          <div className="reply-form">
            <Form onSubmit={handlePostReply}>
              <Form.Group controlId="postMessage">
                <Form.Label>Post Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                      createdBy: rootStore.user.user.id,
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Reply
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

export default observer(ThreadPage);
