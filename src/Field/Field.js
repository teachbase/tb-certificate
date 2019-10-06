import React, { PropTypes } from 'react';
import i18next from 'i18next';
import { Col, Form } from 'react-bootstrap';

import { constants } from '../constants';
import FieldBox from '../FieldBox';

import './Field.css';

const Field = (props) => {
  const {
    chosen,
    id,
    text,
    style,
    handleFormControlChange,
    onResize,
    onCheckboxChange
  } = props;

  return (
    <Form.Row className="field">
      <Col className="well" id={id} sm={{ span: 6, offset: 3 }}>
        <Form.Check
          label={text}
          style={{ width: '50%' }}
          inline
          name={id}
          onChange={onCheckboxChange}
        />
        { chosen && <FieldBox onResize={onResize} id={id} style={style} /> }
        { chosen && (
          <div className="field-group">
            <Form.Group className="form-group">
              <Form.Label>{i18next.t('font_size')}</Form.Label>
              <Form.Control
                type="number"
                value={parseInt(style.fontSize, 10)}
                max={constants.maxFontSize}
                name={id}
                data-css-name="fontSize"
                placeholder={i18next.t('font_size')}
                onChange={handleFormControlChange}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>{i18next.t('color')}</Form.Label>
              <Form.Control
                type="color"
                data-css-name="color"
                name={id}
                value={style.color}
                onChange={handleFormControlChange}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>{i18next.t('text_align.title')}</Form.Label>
              <Form.Control
                value={style.textAlign}
                name={id}
                data-css-name="textAlign"
                componentClass="select"
                placeholder={i18next.t('text_align.title')}
                onChange={handleFormControlChange}
              >
                <option value="left">{i18next.t('text_align.left')}</option>
                <option value="center">{i18next.t('text_align.center')}</option>
                <option value="right">{i18next.t('text_align.right')}</option>
              </Form.Control>
            </Form.Group>
          </div>
        )}
      </Col>
    </Form.Row>
  );
};

Field.propTypes = {
  chosen:                  PropTypes.bool,
  id:                      PropTypes.string.isRequired,
  text:                    PropTypes.string.isRequired,
  style:                   PropTypes.object.isRequired,
  handleFormControlChange: PropTypes.func.isRequired,
  onCheckboxChange:        PropTypes.func.isRequired,
  onResize:                PropTypes.func.isRequired,
};

Field.defaultProps = {
  chosen: false,
};

export default Field;
