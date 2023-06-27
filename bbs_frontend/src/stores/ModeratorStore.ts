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
        fetch(`${process.env.REACT_APP_BASE_API_URL}/moderators/`),
      );
      const data = yield* _await(response.json());
      this.moderators = data;
    } catch (error) {
      console.log('Error getting moderators:', error);
      this.moderators = [];
    }
  });
}
