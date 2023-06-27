import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

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

@model('UsersStore')
export class UsersStore extends Model({
  users: prop<User[]>(() => []),
}) {
  @modelFlow
  getUsers = _async(function* (this: UsersStore) {
    try {
      const response = yield* _await(fetch('http://127.0.0.1:8000/api/users/'));
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (user: {
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
        }) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          aboutMyself: user.about_myself,
          dateOfBirth: user.date_of_birth,
          hometown: user.hometown,
          presentLocation: user.present_location,
          website: user.website,
          gender: user.gender,
          interests: user.interests,
        }),
      );
      this.users = updatedData;
    } catch (error) {
      console.log('Error getting users:', error);
      this.users = [];
    }
  });
}
