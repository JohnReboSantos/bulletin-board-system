import React, { useState } from 'react';
import { Form, Button, Navbar } from 'react-bootstrap';
import { useStore } from '../stores/RootStore';

const RegistrationPage = () => {
  const rootStore = useStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    about_myself: '',
    date_of_birth: '',
    hometown: '',
    present_location: '',
    website: '',
    gender: '',
    interests: '',
  });

  interface User {
    username: string;
    email: string;
    password1: string;
    password2: string;
    about_myself: string;
    date_of_birth: string;
    hometown: string;
    present_location: string;
    website: string;
    gender: string;
    interests: string;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(formData);

    const register = async (formData: User) => {
      try {
        await rootStore.user.register(formData);
        console.log('Success');
      } catch (error) {
        console.error('Registration error:', error);
      }
    };

    register(formData);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary">Log in</Button>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
      <div className="registration-page">
        <h2>Registration</h2>
        <Form onSubmit={handleSubmit}>
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
              value={formData.about_myself}
              onChange={(e) =>
                setFormData({ ...formData, about_myself: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formDateOfBirth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
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
              value={formData.present_location}
              onChange={(e) =>
                setFormData({ ...formData, present_location: e.target.value })
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

export default RegistrationPage;
