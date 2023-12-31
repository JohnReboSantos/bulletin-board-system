import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Button, Navbar } from 'react-bootstrap';
import { useStore } from '../stores/RootStore';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const rootStore = useStore();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  interface User {
    email: string;
    password: string;
  }

  const handleSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      const login = async (formData: User) => {
        try {
          await rootStore.user.login(formData);
          await rootStore.user.getUser();
          rootStore.user.user.id ? setIsLoggedIn(true) : setIsLoggedIn(false);
        } catch (error) {
          console.error('Login error:', error);
        }
      };

      login(formData);
    },
    [formData, rootStore.user],
  );

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Link to="/register">
              <Button variant="primary">Register</Button>
            </Link>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
      <div className="login-page">
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default observer(LoginPage);
