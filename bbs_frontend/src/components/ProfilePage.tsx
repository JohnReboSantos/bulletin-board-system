import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import localForage from 'localforage';
import {
  Card,
  ListGroup,
  Pagination,
  Button,
  Form,
  Navbar,
} from 'react-bootstrap';
import { convertToHumanizedTimestamp, useIsAdminOrMod } from './utils';
import { useStore } from '../stores/RootStore';
import { Link } from 'react-router-dom';
import { useGetPosts } from './utils';

const ProfilePage = ({
  user,
}: {
  user: {
    id: number;
    username: string;
    email: string;
    aboutMyself: string;
    dateOfBirth: string;
    hometown: string;
    presentLocation: string;
    website: string;
    gender: string;
    interests: string;
  };
}) => {
  const rootStore = useStore();
  const posts = useGetPosts();
  const isAdminOrMod = useIsAdminOrMod();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUser = useCallback(async () => {
    try {
      await rootStore.user.getUser();
      rootStore.user.user.id ? setIsLoggedIn(true) : setIsLoggedIn(false);
      rootStore.user.user.id === user.id
        ? setIsCurrentUser(true)
        : setIsCurrentUser(false);
    } catch (error) {
      console.error('Error getting user:', error);
      setIsLoggedIn(false);
    }
  }, [rootStore.user, user.id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
    const filteredPosts = posts.filter((post) => post.createdBy === user.id);
    const sortedPosts = filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return filteredPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div>{post.message}</div>
        <div>
          <small>{convertToHumanizedTimestamp(post.createdAt)}</small>
        </div>
      </ListGroup.Item>
    ));
  }, [posts, user.id]);

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
                  <Form.Group controlId="formAboutMyself">
                    <Form.Label>About Myself</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      defaultValue={user.aboutMyself}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" defaultValue={user.dateOfBirth} />
                  </Form.Group>
                  <Form.Group controlId="formHometown">
                    <Form.Label>Hometown</Form.Label>
                    <Form.Control type="text" defaultValue={user.hometown} />
                  </Form.Group>
                  <Form.Group controlId="formPresentLocation">
                    <Form.Label>Present Location</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={user.presentLocation}
                    />
                  </Form.Group>
                  <Form.Group controlId="formWebsite">
                    <Form.Label>Website (Optional)</Form.Label>
                    <Form.Control type="text" defaultValue={user.website} />
                  </Form.Group>
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender (Optional)</Form.Label>
                    <Form.Control type="text" defaultValue={user.gender} />
                  </Form.Group>
                  <Form.Group controlId="formInterests">
                    <Form.Label>Interests (Optional)</Form.Label>
                    <Form.Control type="text" defaultValue={user.interests} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </Form>
              </div>
            )}
          </Card.Body>
        </Card>
        {isAdminOrMod(rootStore.user.user.id) &&
          rootStore.user.user.id !== user.id && (
            <div>
              <Button variant="danger" className="mt-3">
                Ban User
              </Button>
              <Button variant="success" className="mt-3">
                Unban User
              </Button>
            </div>
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

export default observer(ProfilePage);
