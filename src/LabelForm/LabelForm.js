import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import { defaultStyle } from '../constants';
import { setField } from '../redux/actions';

import './LabelForm.css';

class LabelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', name: '', error: false, usedIds: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValidationState() {
    const { id, usedIds } = this.state;
    const error = usedIds.includes(id);

    this.setState({ error });
    return error ? 'error' : null;
  }


  handleChange(event) {
    const { name, value } = event.target;

    if (name === 'id') {
      const { usedIds } = this.state;

      this.setState({ error: usedIds.includes(value) });
    }
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { id, name, usedIds } = this.state;
    const groupName = `ID ${id} ${name || i18next.t('labels.group')}`;
    const labelName = `ID ${id} ${i18next.t('labels.label')}`;

    this.props.setField({
      [`group_${id}`]: {
        chosen: false,
        style: defaultStyle,
        text: groupName
      }
    });
    this.props.setField({
      [`label_group_${id}`]: {
        chosen: false,
        style: defaultStyle,
        text: labelName
      }
    });
    this.setState({ id: '', name: '', usedIds: [...usedIds, id] });
  }

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="label-form">
        <FormGroup controlId="LabelFormId" className="label-form-field" validationState={error ? 'error' : null}>
          <FormControl
            required
            className="label-form-id"
            type="text"
            name="id"
            value={this.state.id}
            placeholder={i18next.t('labels.placeholder.id')}
            onChange={this.handleChange}
          />
          { error &&
            <FormControl.Feedback>
              <p>{i18next.t('labels.validation.not_uniq')}</p>
            </FormControl.Feedback>
          }
        </FormGroup>
        <FormGroup controlId="LabelFormName" className="label-form-field">
          <FormControl
            required
            className="label-form-name"
            type="text"
            name="name"
            value={this.state.name}
            placeholder={i18next.t('labels.placeholder.name')}
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button type="submit">{i18next.t('labels.add')}</Button>
      </form>
    );
  }
}

export default connect(null, { setField })(LabelForm);
