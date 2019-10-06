import React, { Component, PropTypes } from 'react';
import i18next from 'i18next';
import copy from 'copy-to-clipboard';

import Toggle from 'react-bootstrap-toggle';
import { Alert, Row, Col, FormControl, Button, FormGroup, ControlLabel } from 'react-bootstrap';

import { connect } from 'react-redux';

import Preview from './Preview';
import LabelForm from './LabelForm';
import FieldList from './FieldList';

import './App.css';
import './bootstrap-toggle.css';

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
      lang: 'ru',
      previewSrc: '',
      json: null
    };

    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.calcJSON = this.calcJSON.bind(this);
    this.copyJSON = this.copyJSON.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onChangeLang = this.onChangeLang.bind(this);
  }

  componentWillMount() {
    const { lang } = this.state;

    i18next.init({
      lng: lang,
      resources: Object.assign(ru, en)
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
      const field = this.props.fields[elemId];
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
          source: elemId,
          ...field.customText && { text: field.customText }
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

  render() {
    const { error, previewSrc, lang, mode, json, size } = this.state;

    return (
      <div className="App">
        {error && (
          <Col sm={6} smOffset={3}>
            <Alert className="text-center" bsStyle="danger" onDismiss={this.handleAlertDismiss}>{error}</Alert>
          </Col>
        )}
        <Col sm={4} md={4} className="fields">
          <FieldList lang={this.state.lang} fields={this.props.fields} />
          <h4>{i18next.t('labels.title')}</h4>
          <LabelForm lang={this.state.lang} addLabels={this.addLabels} />
        </Col>
        <Col sm={7} md={7}>
          <Row>
            <Col sm={3} smOffset={3}>
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
            <Col sm={3}>
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
          <Row className="controls-container text-center">
            <Button onClick={this.calcJSON}>{i18next.t('controls.get_json')}</Button>
            <Button onClick={this.copyJSON}>{i18next.t('controls.copy_json')}</Button>
            <FormControl
              rows={5}
              componentClass="textarea"
              value={(json || undefined) && JSON.stringify(json)}
              readOnly
            />
          </Row>
        </Col>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { fields } = state;

  return { fields };
};

App.propTypes = {
  fields: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(App);
