import * as types from './actionTypes';

export const AddField = field => ({
  type: types.ADD_FIELD, field
});

export const removeField = field => ({
  type: types.REMOVE_FIELD, field
});
