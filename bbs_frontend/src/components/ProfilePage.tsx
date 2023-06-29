import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import localForage from 'localforage';
import {
  Card,
  ListGroup,
  Pagination,
  Button,
  Form,
  Navbar,
  Image,
} from 'react-bootstrap';
import './NavBar.css';
import {
  convertToHumanizedTimestamp,
  useIsAdmin,
  useIsAdminOrMod,
  useIsPoster,
} from './utils';
import { useStore } from '../stores/RootStore';
import { Link } from 'react-router-dom';
import { useGetPosts } from './utils';

const ProfilePage = ({
  user,
}: {
  user: {
    id: number;
    avatar: string;
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
  const IsAdmin = useIsAdmin();
  const isAdminOrMod = useIsAdminOrMod();
  const isPoster = useIsPoster();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    avatar: '',
    id: user.id,
    username: user.username,
    email: user.email,
    aboutMyself: user.aboutMyself,
    dateOfBirth: user.dateOfBirth,
    hometown: user.hometown,
    presentLocation: user.presentLocation,
    website: user.website,
    gender: user.gender,
    interests: user.interests,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const updateProfile = async (user: {
        id: number;
        avatar: string;
        username: string;
        email: string;
        aboutMyself: string;
        dateOfBirth: string;
        hometown: string;
        presentLocation: string;
        website: string;
        gender: string;
        interests: string;
      }) => {
        try {
          await rootStore.user.patchUser(user);
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };
      updateProfile(formData);
    },
    [formData, rootStore.user],
  );

  const handleBan = useCallback(
    async (userId: number) => {
      try {
        await rootStore.posters.deletePoster(userId);
        await rootStore.posters.getPosters();
      } catch (error) {
        console.error('Error banning user:', error);
      }
    },
    [rootStore.posters],
  );

  const handleUnban = useCallback(
    async (userId: number) => {
      try {
        await rootStore.posters.postPoster(userId);
        await rootStore.posters.getPosters();
      } catch (error) {
        console.error('Error banning user:', error);
      }
    },
    [rootStore.posters],
  );

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

  const currentUser = useMemo(() => rootStore.user.user, [rootStore.user.user]);

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

  const postsPerPage = 20;
  const totalPages = useMemo(() => {
    const filteredPosts = posts.filter((post) => post.createdBy === user.id);
    const pages = Math.ceil(filteredPosts.length / postsPerPage);
    return pages;
  }, [posts, user.id]);

  const renderPosts = useCallback(() => {
    const filteredPosts = posts.filter((post) => post.createdBy === user.id);
    const sortedPosts = filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    return currentPosts.map((post) => (
      <ListGroup.Item key={post.id}>
        <div>{post.message}</div>
        <div>
          <small>{convertToHumanizedTimestamp(post.createdAt)}</small>
        </div>
      </ListGroup.Item>
    ));
  }, [currentPage, posts, user.id]);

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
      <div className="user-profile-page">
        <Card>
          <Card.Body>
            <Card.Title>{user.username}</Card.Title>
            <Card.Text>Email: {user.email}</Card.Text>
            {isCurrentUser && (
              <div className="profile-form">
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group controlId="formAvatar">
                    <Form.Label>Avatar Picture</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const dataURL = reader.result as string;
                            setFormData({ ...formData, avatar: dataURL });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formUsername">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formAboutMyself">
                    <Form.Label>About Myself</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.aboutMyself}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutMyself: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formDateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formHometown">
                    <Form.Label>Hometown</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.hometown}
                      onChange={(e) =>
                        setFormData({ ...formData, hometown: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formPresentLocation">
                    <Form.Label>Present Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.presentLocation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          presentLocation: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formWebsite">
                    <Form.Label>Website (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formGender">
                    <Form.Label>Gender (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="formInterests">
                    <Form.Label>Interests (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.interests}
                      onChange={(e) =>
                        setFormData({ ...formData, interests: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update Profile
                  </Button>
                </Form>
              </div>
            )}
          </Card.Body>
        </Card>
        {isPoster(user.id) &&
          isAdminOrMod(currentUser.id) &&
          !IsAdmin(user.id) &&
          currentUser.id !== user.id && (
            <div>
              <Button
                variant="danger"
                className="mt-3"
                onClick={() => handleBan(user.id)}
              >
                Ban User
              </Button>
            </div>
          )}
        {!isPoster(user.id) &&
          isAdminOrMod(currentUser.id) &&
          !IsAdmin(user.id) &&
          currentUser.id !== user.id && (
            <div>
              <Button
                variant="success"
                className="mt-3"
                onClick={() => handleUnban(user.id)}
              >
                Unban User
              </Button>
            </div>
          )}
        <h4 className="mt-4">Posts</h4>
        <Card>
          <ListGroup variant="flush">{renderPosts()}</ListGroup>
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
      </div>
    </div>
  );
};

export default observer(ProfilePage);
