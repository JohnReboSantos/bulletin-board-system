import React, { useEffect, useCallback, useMemo } from 'react';
// import { Link } from 'react-router-dom';
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

  console.log('thread in ThreadPage:', thread);

  const getThreads = useCallback(async () => {
    try {
      await rootStore.threads.getThreads();
    } catch (error) {
      console.error('Error getting threads:', error);
    }
  }, [rootStore.threads]);

  useEffect(() => {
    getThreads();
  }, [getThreads]);

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
  );

  const getThreadTitle = useCallback(
    (threadId: number) => {
      const thread = memoizedThreads.find((thread) => thread.id === threadId);
      return thread ? thread.title : '';
    },
    [memoizedThreads],
  );

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

    console.log('filteredPosts:', filteredPosts);

    return filteredPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div className="d-flex justify-content-between align-items-center">
          <div>{post.created_by}</div>
          <div>
            <small>{post.created_at}</small>
          </div>
        </div>
        <div className="mt-2">{post.message}</div>
      </ListGroup.Item>
    ));
  }, [getThreadTitle, memoizedPosts, thread.title]);

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
        <h4>Board: {thread.board}</h4>
        <Card>
          <ListGroup variant="flush">{renderPosts()}</ListGroup>
        </Card>
        {!thread.locked && (
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
