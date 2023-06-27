import { model, Model, prop, modelFlow, _async, _await } from 'mobx-keystone';

interface Administrator {
  user: number;
}

@model('AdministratorStore')
export class AdministratorStore extends Model({
  administrators: prop<Administrator[]>(() => []),
}) {
  @modelFlow
  getAdministrators = _async(function* (this: AdministratorStore) {
    try {
      const response = yield* _await(
        fetch(`${process.env.REACT_APP_BASE_API_URL}/administrators/`),
      );
      const data = yield* _await(response.json());
      this.administrators = data;
    } catch (error) {
      console.log('Error getting administrators:', error);
      this.administrators = [];
    }
  });
}
