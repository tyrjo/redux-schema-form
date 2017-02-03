import * as types from './actionTypes';

export function setSchemaFormData(formId, key, validationResult) {
  return {
    type: types.SET_SCHEMA_FORM_DATA,
    formId: formId,
    key: key,
    data: validationResult,
  };
}

export function setSchemaFormDataValid(formId, valid) {
  return {
    type: types.SET_SCHEMA_FORM_DATA_VALID,
    formId: formId,
    valid: valid,
  };
}

export function createSchemaFormStore(formId, initialModel) {
  return {
    type: types.CREATE_SCHEMA_FORM_STORE,
    formId: formId,
    initialModel: initialModel,
  };
}

export function removeSchemaFormStore(formId, initialModel) {
  return {
    type: types.REMOVE_SCHEMA_FORM_STORE,
    formId: formId,
    initialModel: initialModel,
  };
}
