/**
 * Created by steve on 11/09/15.
 */
import React, {PropTypes} from 'react';
const utils = require('react-schema-form/lib/utils');
import merge from 'lodash/merge';

class SchemaForm extends React.Component {

  static builder(form, model, index, onChange, mapper, extraProps) {
    const type = form.type;
    const Field = mapper[type];
    if (!Field) {
      console.log('Invalid element type: \"' + form.type + '\"!'); // eslint-disable-line no-console
      return null;
    }
    // TODO (tyr) investigate new Function() instead of eval
    if (form.condition && eval(form.condition) === false) {
      return null;
    }
    return (
      <Field model={model} form={form} key={index} onChange={onChange} mapper={mapper} builder={SchemaForm.builder}
             extraProps={extraProps}/>);
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.mapper = {};
  }

  onChange(key, val) {
    //console.log('SchemaForm.onChange', key, val);
    this.props.onModelChange(key, val);
  }

  render() {
    const merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.option);
    // Will overlay this.mapper with any nested values from this.props.mapper
    const mapper = merge(this.mapper, this.props.mapper || {});
    const forms = merged.map(function (form, index) {
      return SchemaForm.builder(form, this.props.model, index, this.onChange, mapper, this.props.extraProps);
    }.bind(this));

    return (
      <div style={{width: '100%'}} className="SchemaForm">{forms}</div>
    );
  }
}

export default SchemaForm;

SchemaForm.propTypes = {
  form: PropTypes.array.isRequired,
  model: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onModelChange: PropTypes.func,
  mapper: PropTypes.object,
  extraProps: PropTypes.object,
  ignore: PropTypes.object,
  option: PropTypes.object,
};

SchemaForm.defaultProps = {
  onModelChange: ()=> {
  },
  mapper: null,
  extraProps: {},
  ignore: {},
  option: {},
};
