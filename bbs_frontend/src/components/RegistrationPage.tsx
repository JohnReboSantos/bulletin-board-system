import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Navbar } from 'react-bootstrap';
import { useStore } from '../stores/RootStore';

const RegistrationPage = () => {
  const rootStore = useStore();
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: '',
    username: '',
    email: '',
    password1: '',
    password2: '',
    aboutMyself: '',
    dateOfBirth: '',
    hometown: '',
    presentLocation: '',
    website: '',
    gender: '',
    interests: '',
  });

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      const register = async (user: {
        avatar: string;
        username: string;
        email: string;
        password1: string;
        password2: string;
        aboutMyself: string;
        dateOfBirth: string;
        hometown: string;
        presentLocation: string;
        website: string;
        gender: string;
        interests: string;
      }) => {
        try {
          await rootStore.user.register(user);
          await rootStore.user.login({
            email: user.email,
            password: user.password1,
          });
          await rootStore.user.getUser();
          rootStore.user.user.id
            ? setIsRegistered(true)
            : setIsRegistered(false);
        } catch (error) {
          console.error('Registration error:', error);
        }
      };

      register(formData);
    },
    [formData, rootStore.user],
  );

  useEffect(() => {
    if (isRegistered) {
      navigate('/');
    }
  }, [isRegistered, navigate]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Link to="/login">
              <Button variant="primary">Log in</Button>
            </Link>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
      <div className="registration-page">
        <h2>Registration</h2>
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

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
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
              placeholder="Enter username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formPassword1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={formData.password1}
              onChange={(e) =>
                setFormData({ ...formData, password1: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formPassword2">
            <Form.Label>Reenter password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Reenter password"
              value={formData.password2}
              onChange={(e) =>
                setFormData({ ...formData, password2: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formAboutMyself">
            <Form.Label>About Myself</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter about myself"
              value={formData.aboutMyself}
              onChange={(e) =>
                setFormData({ ...formData, aboutMyself: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formDateOfBirth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formHometown">
            <Form.Label>Hometown</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter hometown"
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
              placeholder="Enter present location"
              value={formData.presentLocation}
              onChange={(e) =>
                setFormData({ ...formData, presentLocation: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formWebsite">
            <Form.Label>Website (Optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter website"
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
              placeholder="Enter gender"
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
              placeholder="Enter interests"
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default observer(RegistrationPage);
