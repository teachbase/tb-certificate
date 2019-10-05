import * as types from './actionTypes';

export const setField = field => ({
  type: types.SET_FIELD, field
});

export const removeField = field => ({
  type: types.REMOVE_FIELD, field
});
