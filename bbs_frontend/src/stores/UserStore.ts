import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';
import localForage from 'localforage';

interface User {
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

      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/user/', {
          credentials: 'include',
          headers: headers,
        }),
      );
      const data = yield* _await(response.json());
      const updatedUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        aboutMyself: data.about_myself,
        dateOfBirth: data.date_of_birth,
        hometown: data.hometown,
        presentLocation: data.present_location,
        website: data.website,
        gender: data.gender,
        interests: data.interests,
      };
      this.user = updatedUser;
    } catch (error) {
      console.log('Error getting user:', error);
      this.user = {
        id: 0,
        username: '',
        email: '',
        aboutMyself: '',
        dateOfBirth: '',
        hometown: '',
        presentLocation: '',
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
    aboutMyself: string;
    dateOfBirth: string;
    hometown: string;
    presentLocation: string;
    website: string;
    gender: string;
    interests: string;
  }) {
    try {
      const updatedUser = {
        username: user.username,
        email: user.email,
        about_myself: user.aboutMyself,
        date_of_birth: user.dateOfBirth,
        hometown: user.hometown,
        present_location: user.presentLocation,
        website: user.website,
        gender: user.gender,
        interests: user.interests,
      };
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/auth/registration/', {
          body: JSON.stringify(updatedUser),
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
      this.key = data['key'];
      localForage.setItem('authToken', this.key);
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
