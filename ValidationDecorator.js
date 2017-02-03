import React, {PropTypes} from 'react';
let utils = require('react-schema-form/lib/utils');

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
    }

    componentWillMount() {
      let defaultValue = this.defaultValue();
      let validationResult = this.internalValidate(defaultValue, false);
      this.props.onChange(this.props.form.key, validationResult);
      this.props.extraProps.registerValidationListener(this.validate);
    }

    validate(markFieldDirty) {
      return this.internalValidate(this.localModel().value, markFieldDirty);
    }

    internalValidate(value, markFieldDirty) {
      //console.log('onChangeValidate this.props.form, value', this.props.form, value);
      let validationResult = utils.validate(this.props.form, value);
      let result = {
        key: this.props.form.key,
        value: value,
        valid: validationResult.valid,
        error: validationResult.valid ? null : validationResult.error.message,
        dirty: markFieldDirty,
      };

      return result;
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

      let validationResult = this.internalValidate(value, true);

      //console.log('conhangeValidate this.props.form.key, value', this.props.form.key, value);
      this.props.onChange(this.props.form.key, validationResult);
    }

    localModel() {
      return utils.selectOrSet(this.props.form.key, this.props.model) || {};
    }

    defaultValue() {
      // check if there is a value in the model, if there is, display it. Otherwise, check if
      // there is a default value, display it.
      //console.log('Text.defaultValue key', this.props.form.key);
      //console.log('Text.defaultValue model', this.props.model);
      let value = this.localModel().value;
      //console.log('Text defaultValue value = ', value);

      // check if there is a default value
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
        />
      );
    }
  }

  DecoratorClass.propTypes = {
    model: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    extraProps: PropTypes.object.isRequired,
  };

  return DecoratorClass;
};

export default ValidationDecorator;
