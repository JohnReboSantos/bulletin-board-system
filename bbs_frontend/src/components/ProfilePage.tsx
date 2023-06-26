import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  ListGroup,
  Pagination,
  Button,
  Form,
  Navbar,
} from 'react-bootstrap';
import { useIsAdminOrMod } from './utils';
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
  const isAdminOrMod = useIsAdminOrMod();

  // mali pa to palitan mo ng isLoggedIn or smth
  const getUser = useCallback(async () => {
    try {
      await rootStore.user.getUser();
      setIsCurrentUser(true);
    } catch (error) {
      console.error('Error getting user:', error);
      setIsCurrentUser(false);
    }
  }, [rootStore.user]);

  useEffect(() => {
    getUser();
  }, [getUser]);
  //hanggang dito

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
      (post) => parseInt(post.created_by) === user.id,
    );
    return filteredPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div>{post.message}</div>
        <div>
          <small>{post.created_at}</small>
        </div>
      </ListGroup.Item>
    ));
  }, [memoizedPosts, user.id]);

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
                  <Form.Group controlId="formAboutMyself">
                    <Form.Label>About Myself</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      defaultValue={user.about_myself}
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      defaultValue={user.date_of_birth}
                    />
                  </Form.Group>
                  <Form.Group controlId="formHometown">
                    <Form.Label>Hometown</Form.Label>
                    <Form.Control type="text" defaultValue={user.hometown} />
                  </Form.Group>
                  <Form.Group controlId="formPresentLocation">
                    <Form.Label>Present Location</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={user.present_location}
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
        {isAdminOrMod(user.id) && (
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
