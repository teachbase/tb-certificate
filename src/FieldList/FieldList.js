import React, { Component, PropTypes } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { setField } from '../redux/actions';
import Field from '../Field';
import { constants } from '../constants';

class FieldList extends Component {
  constructor(props) {
    super(props);
    this.handleFormControlChange = this.handleFormControlChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onResize(event, data) {
    const { size } = data;
    const { width, height } = size;
    const name = data.node.parentNode.id;
    const field = this.props.fields[name];

    this.props.setField({
      [name]: {
        ...field,
        style: {
          ...field.style, width, height
        }
      }
    });
  }

  onCheckboxChange(e) {
    const { name, checked } = e.target;
    const field = this.props.fields[name];

    this.props.setField({
      [name]: { ...field, chosen: checked }
    });
  }

  handleFormControlChange(e) {
    const {
      target: {
        name,
        type,
        dataset: {
          cssName
        }
      }
    } = e;
    const field = this.props.fields[name];

    let value = e.target.value;

    if (type === 'number' && parseInt(value, 10) > constants.maxFontSize) return;
    if (type === 'number' && value !== '') {
      value += 'px';
    }

    this.props.setField({
      [name]: {
        ...field,
        style: {
          ...field.style, [cssName]: value
        }
      }
    });
  }

  render() {
    const { lang, fields } = this.props;

    return (
      <div>
        {
          Object.keys(fields).map(fieldId =>
            <Field
              key={fieldId}
              id={fieldId}
              text={fields[fieldId].text || i18next.t(`fields.${fieldId}`)}
              handleFormControlChange={this.handleFormControlChange}
              style={fields[fieldId].style}
              chosen={fields[fieldId].chosen}
              lang={lang}
              onResize={this.onResize}
              onCheckboxChange={this.onCheckboxChange}
            />
          )
        }
      </div>
    );
  }
}

FieldList.propTypes = {
  lang:     PropTypes.string.isRequired,
  setField: PropTypes.func.isRequired,
  fields:   PropTypes.object.isRequired,
};

export default connect(null, { setField })(FieldList);
