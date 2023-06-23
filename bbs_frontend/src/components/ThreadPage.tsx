import React, { useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import { Card, ListGroup, Pagination, Form, Button } from 'react-bootstrap';

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
      (post) => post.thread === thread.title,
    );

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
  }, [memoizedPosts, thread.title]);

  return (
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
  );
};

export default observer(ThreadPage);
