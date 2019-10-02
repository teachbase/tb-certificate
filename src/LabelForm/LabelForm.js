import React from 'react';
import i18next from 'i18next';
import { Form, FormGroup, FormControl, Button } from 'react-bootstrap';

import './LabelForm.css';

class LabelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', name: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <Form>
        <FormGroup controlId="LabelFormId" className="label-form">
          <FormControl
            className="label-form-id"
            type="text"
            name="id"
            value={this.state.id}
            placeholder={i18next.t('labels.placeholder.id')}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="LabelFormName" className="label-form">
          <FormControl
            className="label-form-name"
            type="text"
            name="name"
            value={this.state.name}
            placeholder={i18next.t('labels.placeholder.name')}
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button onClick={this.handleSubmit}>{i18next.t('labels.add')}</Button>
      </Form>
    );
  }
}

export default LabelForm;
