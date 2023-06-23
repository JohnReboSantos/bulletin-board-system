import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Thread {
  id: number;
  title: string;
  board: string;
  created_by: string;
  created_at: string;
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
      this.threads = data;
    } catch (error) {
      console.log('Error getting threads:', error);
      this.threads = [];
    }
  });

  @modelFlow
  postThread = _async(function* (thread: {
    title: string;
    board: string;
    locked: boolean;
  }) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/api/threads/', {
          body: JSON.stringify(thread),
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
