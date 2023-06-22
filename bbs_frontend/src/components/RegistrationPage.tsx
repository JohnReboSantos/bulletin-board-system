import React from 'react';
import { Form, Button } from 'react-bootstrap';

const RegistrationPage = () => {
  return (
    <div className="registration-page">
      <h2>Registration</h2>
      <Form>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>

        <Form.Group controlId="formAboutMyself">
          <Form.Label>About Myself</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter about myself" />
        </Form.Group>

        <Form.Group controlId="formDateOfBirth">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control type="date" />
        </Form.Group>

        <Form.Group controlId="formHometown">
          <Form.Label>Hometown</Form.Label>
          <Form.Control type="text" placeholder="Enter hometown" />
        </Form.Group>

        <Form.Group controlId="formPresentLocation">
          <Form.Label>Present Location</Form.Label>
          <Form.Control type="text" placeholder="Enter present location" />
        </Form.Group>

        <Form.Group controlId="formWebsite">
          <Form.Label>Website (Optional)</Form.Label>
          <Form.Control type="text" placeholder="Enter website" />
        </Form.Group>

        <Form.Group controlId="formGender">
          <Form.Label>Gender (Optional)</Form.Label>
          <Form.Control as="select">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formInterests">
          <Form.Label>Interests (Optional)</Form.Label>
          <Form.Control type="text" placeholder="Enter interests" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default RegistrationPage;
