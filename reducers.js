import initialState from './initialState';
import * as types from './actionTypes';
import objectAssign from 'object-assign';
let utils = require('react-schema-form/lib/utils');

export default function reducer(state = initialState.schemaForm, action) {
  let formData, newState, data;
  switch (action.type) {
    case types.SET_SCHEMA_FORM_DATA_VALID:
      newState = objectAssign({}, state);
      formData = objectAssign({}, newState[action.formId], {formIsValid: action.valid});
      newState[action.formId] = formData;
      return newState;

    case types.SET_SCHEMA_FORM_DATA:
      // TODO - seems overly complex way to deal with immutable objects
      data = action.data; // Get the validation result
      newState = objectAssign({}, state); // Get a new "schemaForm" state
      formData = objectAssign({}, newState[action.formId]); // Get new data for this form instance
      utils.selectOrSet(action.key, formData, data);  // Set that form element's current value (if defined)
      newState[action.formId] = formData; // Store the current form data back into the top-level area for all forms
      return newState;

    case types.CREATE_SCHEMA_FORM_STORE:
      newState = {};
      newState[action.formId] = action.initialModel || {};
      return objectAssign(
        {},
        state,
        newState
      );

    case types.REMOVE_SCHEMA_FORM_STORE:
      newState = objectAssign(
        {},
        state
      );
      newState[action.formId] = undefined;
      return newState;

    default:
      return state;
  }
}
