import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  ListGroup,
  Pagination,
  Button,
  Form,
  Navbar,
} from 'react-bootstrap';
import { useStore } from '../stores/RootStore';

interface User {
  id: number;
  username: string;
  email: string;
  about_myself: string;
  date_of_birth: string;
  hometown: string;
  present_location: string;
  website: string;
  gender: string;
  interests: string;
}

interface ProfilePageProps {
  user: User;
}

const ProfilePage = ({ user }: ProfilePageProps) => {
  const rootStore = useStore();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const isAdminOrModerator = true; // Set to true

  const getUser = useCallback(async () => {
    try {
      await rootStore.users.getUsers();
      setIsCurrentUser(true);
    } catch (error) {
      console.error('Error getting user:', error);
      setIsCurrentUser(false);
    }
  }, [rootStore.users]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
      <div className="user-profile-page">
        <Card>
          <Card.Body>
            <Card.Title>{user.username}</Card.Title>
            <Card.Text>Email: {user.email}</Card.Text>
            {isCurrentUser && (
              <div className="profile-form">
                <Form>
                  {/* Profile form fields */}
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" defaultValue={user.username} />
                  </Form.Group>
                  <Form.Group controlId="formAbout">
                    <Form.Label>About Myself</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      defaultValue={user.about_myself}
                    />
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
          <ListGroup variant="flush">{renderPosts()}</ListGroup>
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
    </div>
  );
};

export default ProfilePage;
