import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

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

@model('UsersStore')
export class UsersStore extends Model({
  users: prop<User[]>(() => []),
}) {
  @modelFlow
  getUsers = _async(function* (this: UsersStore) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/users/`),
      );
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (user: {
          id: number;
          avatar: string;
          username: string;
          email: string;
          about_myself: string;
          date_of_birth: string;
          hometown: string;
          present_location: string;
          website: string;
          gender: string;
          interests: string;
          role: string;
          banned: boolean;
        }) => ({
          id: user.id,
          avatar: user.avatar,
          username: user.username,
          email: user.email,
          aboutMyself: user.about_myself,
          dateOfBirth: user.date_of_birth,
          hometown: user.hometown,
          presentLocation: user.present_location,
          website: user.website,
          gender: user.gender,
          interests: user.interests,
          role: user.role,
          banned: user.banned
        }),
      );
      this.users = updatedData;
    } catch (error) {
      console.log('Error getting users:', error);
      this.users = [];
    }
  });
}
