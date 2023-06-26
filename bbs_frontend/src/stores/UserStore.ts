import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';
import localForage from 'localforage';

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

@model('UserStore')
export class UserStore extends Model({
  key: prop<string>(),
  user: prop<User>(),
}) {
  @modelFlow
  getUser = _async(function* (this: UserStore) {
    try {
      const headers = new Headers();
      const storedToken = yield* _await(localForage.getItem('authToken'));
      if (storedToken) {
        headers.append('Authorization', `Token ${storedToken}`);
      }

      console.log('headers:', headers);

      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/user/', {
          credentials: 'include',
          headers: headers,
        }),
      );
      const data = yield* _await(response.json());
      this.user = data;
      console.log('User logged in:', data);
    } catch (error) {
      console.log('Error getting user:', error);
      this.user = {
        id: 0,
        username: '',
        email: '',
        about_myself: '',
        date_of_birth: '',
        hometown: '',
        present_location: '',
        website: '',
        gender: '',
        interests: '',
      };
    }
  });

  @modelFlow
  register = _async(function* (user: {
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
  }) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/registration/', {
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      if (response.ok) {
        alert('Registered successfully');
      } else {
        alert('Failed Network Request: ' + response.statusText);
      }
    } catch (error) {
      console.log('Registration error:', error);
    }
  });

  @modelFlow
  login = _async(function* (
    this: UserStore,
    user: { email: string; password: string },
  ) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/login/', {
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      const data = yield* _await(response.json());
      console.log('login response:', data);
      this.key = data['key'];
      console.log('this.key:', this.key);
      localForage.setItem('authToken', this.key);
      console.log(
        'localForage.setItem',
        localForage.setItem('authToken', this.key),
      );
      if (response.ok) {
        alert('Logged in successfully');
      } else {
        alert('Failed Network Request:' + response.statusText);
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  });

  @modelFlow
  logout = _async(function* () {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/logout/', {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      localForage.removeItem('authToken');
      if (response.ok) {
        console.log('Logged out successfully');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  });
}
