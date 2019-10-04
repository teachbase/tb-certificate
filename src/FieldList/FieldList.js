import React, { Component, PropTypes } from 'react';
import i18next from 'i18next';
import update from 'immutability-helper';
import Field from '../Field';
import fieldData, { constants } from '../constants';

class FieldList extends Component {
  constructor(props) {
    super(props);
    this.state = { fields: fieldData };
    this.handleFormControlChange = this.handleFormControlChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onResize(event, data) {
    const { size } = data;
    const { width, height } = size;
    const fieldId = data.node.parentNode.id;

    this.setState({
      fields: update(this.state.fields, {
        [fieldId]: {
          style: {
            $merge: {
              width,
              height
            }
          }
        }
      })
    });
  }

  onCheckboxChange(e) {
    const { name, checked } = e.target;

    this.setState({
      fields: update(this.state.fields, {
        [name]: {
          $merge: {
            chosen: checked
          }
        }
      })
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

    let value = e.target.value;

    if (type === 'number' && parseInt(value, 10) > constants.maxFontSize) return;
    if (type === 'number' && value !== '') {
      value += 'px';
    }

    this.setState({
      fields: update(this.state.fields, {
        [name]: {
          style: {
            $merge: {
              [cssName]: value
            }
          }
        }
      })
    });
  }

  render() {
    const { lang } = this.props;
    const { fields } = this.state;

    return (
      <div>
        {
          Object.keys(fields).map(fieldId =>
            <Field
              key={fieldId}
              id={fieldId}
              text={i18next.t(`fields.${fieldId}`)}
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
  lang: PropTypes.string.isRequired,
};

export default FieldList;
