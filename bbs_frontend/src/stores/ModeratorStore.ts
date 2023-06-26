import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Moderator {
  user: number;
}

@model('ModeratorStore')
export class ModeratorStore extends Model({
  moderators: prop<Moderator[]>(() => []),
}) {
  @modelFlow
  getModerators = _async(function* (this: ModeratorStore) {
    try {
      const response = yield* _await(
        fetch('http://127.0.0.1:8000/api/moderators/'),
      );
      const data = yield* _await(response.json());
      this.moderators = data;
    } catch (error) {
      console.log('Error getting moderators:', error);
      this.moderators = [];
    }
  });
}
