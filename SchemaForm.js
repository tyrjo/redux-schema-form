/**
 * Created by steve on 11/09/15.
 */
import React, {PropTypes} from 'react';
let utils = require('react-schema-form/lib/utils');
import _ from 'lodash';

class SchemaForm extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  mapper = {};

  onChange(key, val) {
    //console.log('SchemaForm.onChange', key, val);
    this.props.onModelChange(key, val);
  }

  builder(form, model, index, onChange, mapper, extraProps) {
    let type = form.type;
    let Field = this.mapper[type];
    if (!Field) {
      console.log('Invalid field: \"' + form.key[0] + '\"!'); // eslint-disable-line no-console
      return null;
    }
    if (form.condition && eval(form.condition) === false) {
      return null;
    }
    return (<Field model={model} form={form} key={index} onChange={onChange} mapper={mapper} builder={this.builder}
                  extraProps={extraProps}/>);
  }

  render() {
    let merged = utils.merge(this.props.schema, this.props.form, this.props.ignore, this.props.option);
    //console.log('SchemaForm merged = ', JSON.stringify(merged, undefined, 2));
    let mapper = this.mapper;
    if (this.props.mapper) {
      mapper = _.merge(this.mapper, this.props.mapper);
    }
    let forms = merged.map(function (form, index) {
      return this.builder(form, this.props.model, index, this.onChange, mapper, this.props.extraProps);
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
