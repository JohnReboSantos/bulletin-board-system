import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Poster {
  user: number;
}

@model('PosterStore')
export class PosterStore extends Model({
  posters: prop<Poster[]>(() => []),
}) {
  @modelFlow
  getPosters = _async(function* (this: PosterStore) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/posters/`),
      );
      const data = yield* _await(response.json());
      this.posters = data;
    } catch (error) {
      console.log('Error getting posters:', error);
      this.posters = [];
    }
  });
  @modelFlow
  postPoster = _async(function* (userId: number) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/posters/`, {
          body: JSON.stringify({ user: userId }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }),
      );
      if (response.ok) {
        console.log('New poster');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Error new poster:', error);
    }
  });
  @modelFlow
  deletePoster = _async(function* (userId: number) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/posters/${userId}/`, {
          body: JSON.stringify({ user: userId }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        }),
      );
      if (response.ok) {
        console.log('Poster banned');
      } else {
        console.log('Failed Network Request');
      }
    } catch (error) {
      console.log('Error banning poster:', error);
    }
  });
}
