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
        fetch('http://127.0.0.1:8000/api/posters/'),
      );
      const data = yield* _await(response.json());
      this.posters = data;
    } catch (error) {
      console.log('Error getting posters:', error);
      this.posters = [];
    }
  });
}
