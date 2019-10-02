import React, { Component } from 'react';
import i18next from 'i18next';
import update from 'immutability-helper';
import copy from 'copy-to-clipboard';

import Toggle from 'react-bootstrap-toggle';
import { Alert, Row, Col, FormControl, Button, FormGroup, ControlLabel } from 'react-bootstrap';

import Preview from './Preview';
import Field from './Field';
import LabelForm from './LabelForm';

import './App.css';
import './bootstrap-toggle.css';

import fieldData, { constants } from './constants';

import ru from './translations/ru.json';
import en from './translations/en.json';

class App extends Component {
  static getCoords(elem) {
    const box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  }

  static toUnderscore(str) {
    return str.replace(/[A-Z]/g, s => `_${s.toLowerCase()}`);
  }

  constructor(props) {
    super(props);

    this.state = {
      size: 'A4',
      mode: 'portrait',
      error: null,
      fields: fieldData,
      lang: 'ru',
      previewSrc: '',
      json: null
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.calcJSON = this.calcJSON.bind(this);
    this.copyJSON = this.copyJSON.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onChangeLang = this.onChangeLang.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.handleFormControlChange = this.handleFormControlChange.bind(this);
  }

  componentWillMount() {
    const { lang } = this.state;

    i18next.init({
      lng: lang,
      resources: Object.assign(ru, en)
    });
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

  onChange(e) {
    const fileToSend = e.target.files[0];

    if (!fileToSend) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        previewSrc: reader.result
      });
    };

    if (fileToSend.type.indexOf('image') > -1) {
      reader.readAsDataURL(fileToSend);
    } else {
      this.initErrorPopup(i18next.t('errors.not_image'));
    }
  }

  onChangeMode(isPortrait) {
    this.setState({ mode: isPortrait ? 'portrait' : 'landscape' });
  }

  onChangeLang(isRu) {
    const lang = isRu ? 'ru' : 'en';

    this.setState({ lang }, i18next.changeLanguage(lang));
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

  calcJSON() {
    const viewport = document.querySelector('.certificate-preview-container');
    const benchmarkX = App.getCoords(viewport).left;
    const benchmarkY = App.getCoords(viewport).top + Math.round(parseFloat(getComputedStyle(viewport).height));

    const { size, mode } = this.state;
    const json = {
      fields: [],
      layout: mode,
      size
    };

    document.querySelectorAll('.field-box').forEach((elem) => {
      const elemId = elem.id;
      const {
        fields: {
          [elemId]: field
        }
      } = this.state;

      const x = Math.round(App.getCoords(elem).left - benchmarkX);
      const y = Math.round(benchmarkY - App.getCoords(elem).top);

      if (field.chosen) {
        json.fields.push({
          x,
          y,
          width: field.style.width,
          height: field.style.height,
          align: field.style.textAlign,
          font_color: field.style.color.slice(1),
          font_size: parseInt(field.style.fontSize, 10),
          source: elemId
        });
      }
    });

    this.setState({ json });
  }

  copyJSON() {
    copy(JSON.stringify(this.state.json));
  }

  initErrorPopup(errorMessage) {
    this.setState({
      error: errorMessage
    });
    setTimeout(() => {
      this.setState({
        error: null
      });
    }, 3000);
  }

  handleAlertDismiss() {
    this.setState({ error: null });
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

  renderFields() {
    const { lang, fields } = this.state;

    return Object.keys(fields).map(fieldId => {
      const { style, chosen } = fields[fieldId];

      return (
        <Field
          key={fieldId}
          id={fieldId}
          handleFormControlChange={this.handleFormControlChange}
          style={style}
          chosen={chosen}
          lang={lang}
          onResize={this.onResize}
          onCheckboxChange={this.onCheckboxChange}
        />
      );
    });
  }

  render() {
    const { error, previewSrc, lang, mode, json, size } = this.state;

    return (
      <div className="App">
        {error && (
          <Col sm={6} smOffset={3}>
            <Alert className="text-center" bsStyle="danger" onDismiss={this.handleAlertDismiss}>{error}</Alert>
          </Col>
        )}
        <Row>
          <Col sm={2} smOffset={4}>
            <FormGroup className="mode-group">
              <ControlLabel>{i18next.t('page_orientation.title')}</ControlLabel>
              <br />
              <Toggle
                onClick={this.onChangeMode}
                on={i18next.t('page_orientation.portrait')}
                off={i18next.t('page_orientation.landscape')}
                size="sm"
                offstyle="primary"
                active={mode === 'portrait'}
              />
            </FormGroup>
          </Col>
          <Col sm={2}>
            <FormGroup>
              <ControlLabel>{i18next.t('language.title')}</ControlLabel>
              <br />
              <Toggle
                onClick={this.onChangeLang}
                on={i18next.t('language.russian')}
                off={i18next.t('language.english')}
                size="sm"
                offstyle="primary"
                active={lang === 'ru'}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Preview size={size} mode={mode} onChange={this.onChange} previewSrc={previewSrc} />
          </Col>
        </Row>
        <br />
        {this.renderFields()}
        <LabelForm lang={this.state.lang} />
        <Row className="controls-container text-center">
          <Col sm={6} smOffset={3}>
            <Button onClick={this.calcJSON}>{i18next.t('controls.get_json')}</Button>
            <Button onClick={this.copyJSON}>{i18next.t('controls.copy_json')}</Button>
            <FormControl
              rows={5}
              componentClass="textarea"
              value={(json || undefined) && JSON.stringify(json)}
              readOnly
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
