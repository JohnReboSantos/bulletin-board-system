import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Thread {
  id: number;
  title: string;
  board: string;
  createdBy: string;
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
        fetch('http://127.0.0.1:8000/api/threads/'),
      );
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (thread: {
          id: number;
          title: string;
          board: string;
          created_by: string;
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
    board: string;
    createdBy: string;
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
        fetch('http://127.0.0.1:8000/api/threads/', {
          body: JSON.stringify(updatedThread),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
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
