import * as types from './actionTypes';
import fieldData from '../constants';

const initialState = { fields: fieldData };

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SET_FIELD:
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
