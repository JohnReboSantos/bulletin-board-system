import React from 'react';
import { UserStore } from './UserStore';
import { BoardStore } from './BoardStore';
import { ThreadStore } from './ThreadStore';
import { PostStore } from './PostStore';
import { model, Model, prop, registerRootStore } from 'mobx-keystone';

@model('RootStore')
class RootStore extends Model({
  user: prop<UserStore>(),
  boards: prop<BoardStore>(),
  threads: prop<ThreadStore>(),
  posts: prop<PostStore>(),
}) {}

const StoreContext = React.createContext<RootStore>({} as RootStore);

const useStore = () => React.useContext(StoreContext);
const { Provider: StoreProvider } = StoreContext;

function createRootStore() {
  const user = new UserStore({
    user: {
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
    },
  });
  const boards = new BoardStore({});
  const threads = new ThreadStore({});
  const posts = new PostStore({});
  const rootStore = new RootStore({
    user,
    boards,
    threads,
    posts,
  });

  registerRootStore(rootStore);

  return rootStore;
}

export { RootStore, StoreProvider, createRootStore, useStore };
