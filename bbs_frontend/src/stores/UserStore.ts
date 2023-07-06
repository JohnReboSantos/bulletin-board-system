import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';
import localForage from 'localforage';

interface User {
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
  role: string;
  banned: boolean;
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
        fetch(`${process.env.REACT_APP_BASE_AUTH_URL}/user/`, {
          credentials: 'include',
          headers: headers,
        }),
      );
      const data = yield* _await(response.json());
      const updatedUser: User = {
        id: data.id,
        avatar: data.avatar,
        username: data.username,
        email: data.email,
        aboutMyself: data.about_myself,
        dateOfBirth: data.date_of_birth,
        hometown: data.hometown,
        presentLocation: data.present_location,
        website: data.website,
        gender: data.gender,
        interests: data.interests,
        role: data.role,
        banned: data.banned
      };
      this.user = updatedUser;
    } catch (error) {
      console.log('Error getting user:', error);
      this.user = {
        id: 0,
        avatar: '',
        username: '',
        email: '',
        aboutMyself: '',
        dateOfBirth: '',
        hometown: '',
        presentLocation: '',
        website: '',
        gender: '',
        interests: '',
        role: 'poster',
        banned: false
      };
    }
  });

  @modelFlow
  register = _async(function* (user: {
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
  }) {
    try {
      const formData = new FormData();
      formData.append('avatar', user.avatar);
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('password1', user.password1);
      formData.append('password2', user.password2);
      formData.append('about_myself', user.aboutMyself);
      formData.append('date_of_birth', user.dateOfBirth);
      formData.append('hometown', user.hometown);
      formData.append('present_location', user.presentLocation);
      formData.append('website', user.website);
      formData.append('gender', user.gender);
      formData.append('interests', user.interests);
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_AUTH_URL}/registration/`, {
          body: formData,
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
      const response: any = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_AUTH_URL}/login/`, {
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      const data: any = yield* _await(response.json());
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
        fetch(`${process.env.REACT_APP_BASE_AUTH_URL}/logout/`, {
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

  @modelFlow
  updateProfile = _async(function* (user: User) {
    try {
      const formData = new FormData();
      if (user.avatar !== '') {
        formData.append('avatar', user.avatar);
      }
      formData.append('username', user.username);
      formData.append('email', user.email);
      formData.append('about_myself', user.aboutMyself);
      formData.append('date_of_birth', user.dateOfBirth);
      formData.append('hometown', user.hometown);
      formData.append('present_location', user.presentLocation);
      formData.append('website', user.website);
      formData.append('gender', user.gender);
      formData.append('interests', user.interests);
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/users/${user.id}/`, {
          body: formData,
          method: 'PATCH',
        }),
      );
      if (response.ok) {
        alert('Updated profile successfully');
      } else {
        alert('Failed Network Request: ' + response.statusText);
      }
    } catch (error) {
      console.log('Profile update error:', error);
    }
  });

  @modelFlow
  banUser = _async(function* (userId: number) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/users/${userId}/`, {
          body: JSON.stringify({banned: true}),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }),
      );
      if (response.ok) {
        alert('User banned successfully');
      } else {
        alert('Failed Network Request: ' + response.statusText);
        console.log(JSON.stringify({banned: true}))
      }
    } catch (error) {
      console.log('Ban error:', error);
    }
  });

  @modelFlow
  unbanUser = _async(function* (userId: number) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/users/${userId}/`, {
          body: JSON.stringify({banned: false}),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }),
      );
      if (response.ok) {
        alert('User unbanned successfully');
      } else {
        alert('Failed Network Request: ' + response.statusText);
      }
    } catch (error) {
      console.log('Unban error:', error);
    }
  });
}
