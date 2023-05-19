import * as create from './create';
import * as fetch from './fetch';
import * as remove from './remove';
import * as update from './update';
export default {
  ...create,
  ...fetch,
  ...remove,
  ...update,
};
