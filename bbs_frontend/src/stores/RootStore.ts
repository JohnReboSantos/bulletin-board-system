import React from 'react';
import { UserStore } from './UserStore';
import { BoardStore } from './BoardStore';
import { ThreadStore } from './ThreadStore';
import { PostStore } from './PostStore';
import { UsersStore } from './UsersStore';
import { AdministratorStore } from './AdministratorStore';
import { ModeratorStore } from './ModeratorStore';
import { PosterStore } from './PosterStore';
import { model, Model, prop, registerRootStore } from 'mobx-keystone';

@model('RootStore')
class RootStore extends Model({
  user: prop<UserStore>(),
  boards: prop<BoardStore>(),
  threads: prop<ThreadStore>(),
  posts: prop<PostStore>(),
  users: prop<UsersStore>(),
  administrators: prop<AdministratorStore>(),
  moderators: prop<ModeratorStore>(),
  posters: prop<PosterStore>(),
}) {}

const StoreContext = React.createContext<RootStore>({} as RootStore);

const useStore = () => React.useContext(StoreContext);
const { Provider: StoreProvider } = StoreContext;

function createRootStore() {
  const user = new UserStore({
    key: '',
    user: {
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
    },
  });
  const boards = new BoardStore({});
  const threads = new ThreadStore({});
  const posts = new PostStore({});
  const users = new UsersStore({});
  const administrators = new AdministratorStore({});
  const moderators = new ModeratorStore({});
  const posters = new PosterStore({});
  const rootStore = new RootStore({
    user,
    boards,
    threads,
    posts,
    users,
    administrators,
    moderators,
    posters,
  });

  registerRootStore(rootStore);

  return rootStore;
}

export { RootStore, StoreProvider, createRootStore, useStore };
