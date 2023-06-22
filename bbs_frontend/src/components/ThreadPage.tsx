import React from 'react';
import { Card, ListGroup, Pagination, Form, Button } from 'react-bootstrap';

const ThreadPage = () => {
  const thread = {
    id: 1,
    title: 'Thread Title',
    board: 'Board Name',
    posts: [
      {
        id: 1,
        posterName: 'User A',
        avatar: 'avatar_url',
        date: '2023-06-01',
        message: 'Post message 1',
      },
      {
        id: 2,
        posterName: 'User B',
        avatar: 'avatar_url',
        date: '2023-06-02',
        message: 'Post message 2',
      },
      // Add more post objects as needed
    ],
    locked: false,
  };

  const renderPosts = () => {
    return thread.posts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div className="d-flex justify-content-between align-items-center">
          <div>{post.posterName}</div>
          <div>
            <small>{post.date}</small>
          </div>
        </div>
        <div className="mt-2">{post.message}</div>
      </ListGroup.Item>
    ));
  };

  return (
    <div className="thread-index-page">
      <h2>{thread.title}</h2>
      <h4>Board: {thread.board}</h4>
      <Card>
        <ListGroup variant="flush">
          {renderPosts()}
        </ListGroup>
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

export default ThreadPage;
