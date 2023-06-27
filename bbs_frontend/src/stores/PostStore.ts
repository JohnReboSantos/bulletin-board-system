import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Post {
  id: number;
  thread: string;
  createdBy: string;
  createdAt: string;
  message: string;
}

@model('PostStore')
export class PostStore extends Model({
  posts: prop<Post[]>(() => []),
}) {
  @modelFlow
  getPosts = _async(function* (this: PostStore) {
    try {
      const response = yield* _await(fetch('http://127.0.0.1:8000/api/posts/'));
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (post: {
          id: number;
          thread: string;
          created_by: string;
          created_at: string;
          message: string;
        }) => ({
          id: post.id,
          thread: post.thread,
          createdBy: post.created_by,
          createdAt: post.created_at,
          message: post.message,
        }),
      );
      this.posts = updatedData;
    } catch (error) {
      console.log('Error getting posts:', error);
      this.posts = [];
    }
  });

  @modelFlow
  postPost = _async(function* (thread: {
    thread: string;
    message: string;
    createdBy: string;
  }) {
    try {
      const updatedThread = {
        thread: thread.thread,
        message: thread.message,
        created_by: thread.createdBy,
      };
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/api/posts/', {
          body: JSON.stringify(updatedThread),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      if (response.ok) {
        console.log('Uploaded post successfully');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Error uploading post:', error);
    }
  });
}
