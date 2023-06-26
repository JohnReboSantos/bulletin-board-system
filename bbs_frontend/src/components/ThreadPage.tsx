import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import {
  Card,
  ListGroup,
  Pagination,
  Form,
  Button,
  Navbar,
} from 'react-bootstrap';
import { useGetBoardName, useGetThreadTitle, useGetUsername } from './utils';

const ThreadPage: React.FC<{
  thread: {
    id: number;
    title: string;
    board: string;
    created_by: string;
    created_at: string;
    locked: boolean;
  };
}> = ({ thread }) => {
  const rootStore = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getBoardName = useGetBoardName();
  const getThreadTitle = useGetThreadTitle();
  const getUsername = useGetUsername();

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

  const getPosts = useCallback(async () => {
    try {
      await rootStore.posts.getPosts();
    } catch (error) {
      console.error('Error getting posts:', error);
    }
  }, [rootStore.posts]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const memoizedPosts = useMemo(
    () => rootStore.posts.posts,
    [rootStore.posts.posts],
  );

  const renderPosts = useCallback(() => {
    const filteredPosts = memoizedPosts.filter(
      (post) => getThreadTitle(parseInt(post.thread)) === thread.title,
    );

    return filteredPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/user_${post.created_by}`}>
            <div>{getUsername(parseInt(post.created_by))}</div>
          </Link>
          <div>
            <small>{post.created_at}</small>
          </div>
        </div>
        <div className="mt-2">{post.message}</div>
      </ListGroup.Item>
    ));
  }, [getThreadTitle, getUsername, memoizedPosts, thread.title]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary">Log in</Button>
            <Button variant="primary">Register</Button>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
      <div className="thread-index-page">
        <h2>{thread.title}</h2>
        <h4>Board: {getBoardName(parseInt(thread.board))}</h4>
        <Card>
          <ListGroup variant="flush">{renderPosts()}</ListGroup>
        </Card>
        {isLoggedIn && !thread.locked && (
          <div className="reply-form">
            <Form>
              <Form.Group controlId="postMessage">
                <Form.Label>Post Message</Form.Label>
                <Form.Control as="textarea" rows={3} />
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
