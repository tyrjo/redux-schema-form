import React, {PropTypes} from 'react';
const utils = require('react-schema-form/lib/utils');

const ValidationDecorator = (FormItem) => {

  /**
   * Using function closure to capture the supplied FormItem for use in
   * the decorator's render method
   */

  class DecoratorClass extends React.Component {

    constructor(props) {
      super(props);
      this.onChangeValidate = this.onChangeValidate.bind(this);
      this.validate = this.validate.bind(this);
      this.localModel = this.localModel.bind(this);
      this.builder = this.builder.bind(this);
    }

    componentWillMount() {
      // schema is copied onto the form by SchemaForm if a the key is set
      if (!this.props.form.key) {
        throw(
          `Error: form.key not set.
Form element '${this.props.form.type}' requires a 'key' property.  For elements that accept data input,
this 'key' must match one of the schema 'properties' attributes.`
        );
      }

      const defaultValue = this.defaultValue();
      const validationResult = this.internalValidate(defaultValue, false);
      this.props.onChange(this.props.form.key, validationResult);
      this.props.extraProps.registerValidationListener(this.validate);
    }

    validate(markFieldDirty) {
      return this.internalValidate(this.localModel().value, markFieldDirty);
    }

    internalValidate(value, markFieldDirty) {
      //console.log('onChangeValidate this.props.form, value', this.props.form, value);
      const validationResult = utils.validate(this.props.form, value);
      return {
        key: this.props.form.key,
        value: value,
        valid: validationResult.valid,
        error: validationResult.valid ? null : validationResult.error.message,
        dirty: markFieldDirty,
      };
    }

    // TODO (tyr) Is there a way to merge with SchemaForm.builder?
    builder(form, key) {
      const type = form.type;
      const Field = this.props.mapper[type];
      if (!Field) {
        console.log('Invalid element type: \"' + type + '\"!'); // eslint-disable-line no-console
        return null;
      }
      if (form.condition && eval(form.condition) === false) {
        return null;
      }
      return (
        <Field
          key={key}
          model={this.props.model}
          form={form}
          onChange={this.props.onChange}
          mapper={this.props.mapper}
          builder={this.builder}
          extraProps={this.props.extraProps}/>);
    }

    /**
     * Called when <input> value changes.
     * @param e The input element, or something.
     */
    onChangeValidate(e) {
      //console.log('onChangeValidate e', e);
      let value = null;
      if (this.props.form.schema.type === 'integer' || this.props.form.schema.type === 'number') {
        if (e.target.value.indexOf('.') == -1) {
          value = parseInt(e.target.value);
        } else {
          value = parseFloat(e.target.value);
        }

        if (isNaN(value)) {
          value = undefined;
        }


      } else if (this.props.form.schema.type === 'boolean') {
        value = e.target.checked;
      } else if (this.props.form.schema.type === 'date' || this.props.form.schema.type === 'array') {
        value = e;
      } else { // string
        value = e.target.value;
      }

      const validationResult = this.internalValidate(value, true);

      //console.log('conhangeValidate this.props.form.key, value', this.props.form.key, value);
      this.props.onChange(this.props.form.key, validationResult);
    }

    localModel() {
      let result;
      try {
        result = utils.selectOrSet(this.props.form.key, this.props.model) || {};
      } catch (e) {
        result = {};
      }
      return result;
    }

    defaultValue() {
      // check if there is a value in the model, if there is, display it. Otherwise, check if
      // there is a default value, display it.
      //console.log('Text.defaultValue key', this.props.form.key);
      //console.log('Text.defaultValue model', this.props.model);
      let value = this.localModel().value;
      //console.log('Text defaultValue value = ', value);

      // check if there is a default value
      // TODO: using falsy checking may be inadequate here.  Perhaps use lodash.isUndefined()?
      if (!value && this.props.form['default']) {
        value = this.props.form['default'];
      }

      if (!value && this.props.form.schema && this.props.form.schema['default']) {
        value = this.props.form.schema['default'];
      }

      // Support for Select
      // The first value in the option will be the default.
      if (!value && this.props.form.titleMap && this.props.form.titleMap[0].value) {
        value = this.props.form.titleMap[0].value;
      }
      //console.log('value', value);
      return value;
    }

    render() {
      return (
        <FormItem
          {...this.props}
          {...this.state}
          localModel={this.localModel()}
          onChangeValidate={this.onChangeValidate}
          builder={this.builder}
        />
      );
    }
  }

  DecoratorClass.propTypes = {
    model: PropTypes.object.isRequired,
    form: PropTypes.shape({
      key: PropTypes.array.isRequired,
      type: PropTypes.string.isRequired,
      schema: PropTypes.object,
      default: PropTypes.object,
      titleMap: PropTypes.array,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    extraProps: PropTypes.object.isRequired,
    mapper: PropTypes.object.isRequired,
    builder: PropTypes.func.isRequired,
  };

  return DecoratorClass;
};

export default ValidationDecorator;
