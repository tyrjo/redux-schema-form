import initialState from './initialState';
import * as types from './actionTypes';
const utils = require('react-schema-form/lib/utils');
import omit from 'lodash/omit';

export default function reducer(state = initialState.schemaForm, action) {
  switch (action.type) {
    case types.SET_SCHEMA_FORM_DATA_VALID: {
      const formData = Object.assign(
        {},
        state[action.formId],
        {formIsValid: action.valid}
      );
      return Object.assign(
        {},
        state,
        {[action.formId]: formData}
      );
    }

    case types.SET_SCHEMA_FORM_DATA: {
      const data = action.data; // Get the validation result
      let formData = Object.assign(
        {},
        state[action.formId]
      ); // Get new data for this form instance
      utils.selectOrSet(action.key, formData, data);  // Set that form element's current value (if defined)
      return Object.assign(
        {},
        state,
        {[action.formId]: formData}
      );
    }

    case types.CREATE_SCHEMA_FORM_STORE: {
      const newState = {[action.formId]: action.initialModel || {}};
      return Object.assign(
        {},
        state,
        newState
      );
    }

    case types.REMOVE_SCHEMA_FORM_STORE: {
      // Removes only the formId key.
      return omit(state, action.formId);
    }

    default:
      return state;
  }
}
