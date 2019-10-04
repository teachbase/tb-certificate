import * as types from './actionTypes';

const initialState = { fields: {} };

export default function (state = initialState, action) {
  switch (action.type) {
    case types.ADD_FIELD:
      return {
        ...state, fields: { ...state.fields, ...action.field }
      };
    case types.REMOVE_FIELD: {
      const fieldsCopy = Object.assign({}, state.fields);
      const key = Object(action.field).keys[0];

      delete fieldsCopy[key];

      return { ...state, fields: fieldsCopy };
    }
    default:
      return state;
  }
}
