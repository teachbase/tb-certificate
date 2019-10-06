import React from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, Button, FormControlFeedback } from 'react-bootstrap';
import { defaultStyle } from '../constants';
import { setField } from '../redux/actions';

import './LabelForm.css';

class LabelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', name: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { id, name } = this.state;
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
    this.setState({ id: '', name: '' });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup controlId="LabelFormId" className="label-form">
          <FormControl
            required
            className="label-form-id"
            type="text"
            name="id"
            value={this.state.id}
            placeholder={i18next.t('labels.placeholder.id')}
            onChange={this.handleChange}
          />
          <FormControlFeedback
            error={this.state.notUniqId}
            message={i18next.t('labels.validation.not_uniq')}
          />
        </FormGroup>
        <FormGroup controlId="LabelFormName" className="label-form">
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
      </Form>
    );
  }
}

export default connect(null, { setField })(LabelForm);
