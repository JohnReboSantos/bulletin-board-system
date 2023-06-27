import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Board {
  id: number;
  name: string;
  topic: string;
  description: string;
  createdAt: string;
}

@model('BoardStore')
export class BoardStore extends Model({
  boards: prop<Board[]>(() => []),
}) {
  @modelFlow
  getBoards = _async(function* (this: BoardStore) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/api/boards/'),
      );
      const data = yield* _await(response.json());
      const updatedData = data.map(
        (board: {
          id: number;
          name: string;
          topic: string;
          description: string;
          created_at: string;
        }) => ({
          id: board.id,
          name: board.name,
          topic: board.topic,
          description: board.description,
          createdAt: board.created_at,
        }),
      );
      this.boards = updatedData;
    } catch (error) {
      console.log('Error getting boards:', error);
      this.boards = [];
    }
  });

  @modelFlow
  postBoard = _async(function* (board: {
    name: string;
    topic: string;
    description: string;
  }) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/api/boards/', {
          body: JSON.stringify(board),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      if (response.ok) {
        console.log('Posted board successfully');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Error posting board:', error);
    }
  });
}
