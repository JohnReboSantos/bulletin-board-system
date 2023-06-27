import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Thread {
  id: number;
  title: string;
  board: number;
  createdBy: number;
  createdAt: string;
  locked: boolean;
}

@model('ThreadStore')
export class ThreadStore extends Model({
  threads: prop<Thread[]>(() => []),
}) {
  @modelFlow
  getThreads = _async(function* (this: ThreadStore) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/threads/`),
      );
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (thread: {
          id: number;
          title: string;
          board: number;
          created_by: number;
          created_at: string;
          locked: boolean;
        }) => ({
          id: thread.id,
          title: thread.title,
          board: thread.board,
          createdBy: thread.created_by,
          createdAt: thread.created_at,
          locked: thread.locked,
        }),
      );
      this.threads = updatedData;
    } catch (error) {
      console.log('Error getting threads:', error);
      this.threads = [];
    }
  });

  @modelFlow
  postThread = _async(function* (thread: {
    title: string;
    board: number;
    createdBy: number;
    locked: boolean;
  }) {
    try {
      const updatedThread = {
        title: thread.title,
        board: thread.board,
        created_by: thread.createdBy,
        locked: thread.locked,
      };
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/threads/`, {
          body: JSON.stringify(updatedThread),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      console.log(
        'JSON.stringify(updatedThread):',
        JSON.stringify(updatedThread),
      );
      if (response.ok) {
        console.log('Posted thread successfully');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Error posting thread:', error);
    }
  });
}
