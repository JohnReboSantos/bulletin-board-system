import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Post {
    id: number;
    thread: string;
    created_by: string;
    created_at: string;
    message: string;
}

@model('PostStore')
export class PostStore extends Model({
    posts: prop<Post[]>(() => []),
}) {
    @modelFlow
    getPosts = _async(function* (this: PostStore) {
        try {
            const response = yield* _await(
                fetch('http://127.0.0.1:8000/api/posts/'),
            );
            const data = yield* _await(response.json());
            this.posts = data;
        } catch (error) {
            console.log('Error getting posts:', error);
            this.posts = [];
        }
    });

    @modelFlow
    postPost = _async(function* (thread: {
        thread: string;
        message: string;
    }) {
        try {
            const response = yield* _await(
                fetch('http://127.0.0.1:8000/api/posts/', {
                    body: JSON.stringify(thread),
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
