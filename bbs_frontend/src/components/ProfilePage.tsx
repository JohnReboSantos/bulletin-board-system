import React from 'react';
import { Card, ListGroup, Pagination, Button, Form } from 'react-bootstrap';

const UserProfilePage = () => {
    const isAdminOrModerator = true; // Set to true

    const user = {
    name: 'John Doe',
    username: 'johnny',
    email: 'johndoe@example.com',
    isCurrentUser: true, // Set to true for the current logged-in user
    about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  const posts = [
    {
      id: 1,
      message: 'Post message 1',
      date: '2023-06-01',
    },
    {
      id: 2,
      message: 'Post message 2',
      date: '2023-06-02',
    },
    // Add more post objects as needed
  ];

  const renderPosts = () => {
    return posts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div>{post.message}</div>
        <div>
          <small>{post.date}</small>
        </div>
      </ListGroup.Item>
    ));
  };

  return (
    <div className="user-profile-page">
      <Card>
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>Email: {user.email}</Card.Text>
          {user.isCurrentUser && (
            <div className="profile-form">
              <Form>
                {/* Profile form fields */}
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" defaultValue={user.username} />
                </Form.Group>
                <Form.Group controlId="formAbout">
                  <Form.Label>About Myself</Form.Label>
                  <Form.Control as="textarea" rows={3} defaultValue={user.about} />
                </Form.Group>
                {/* Add more profile form fields as needed */}
                <Button variant="primary" type="submit">
                  Update Profile
                </Button>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>
      {isAdminOrModerator && (
        <Button variant="danger" className="mt-3">
          Ban User
        </Button>
      )}
      {!isAdminOrModerator && (
        <Button variant="success" className="mt-3">
          Unban User
        </Button>
      )}
      <h4 className="mt-4">Posts</h4>
      <Card>
        <ListGroup variant="flush">
          {renderPosts()}
        </ListGroup>
      </Card>
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

export default UserProfilePage;
