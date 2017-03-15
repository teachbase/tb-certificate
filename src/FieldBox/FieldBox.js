import React, { PropTypes } from 'react';
import i18next from 'i18next';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';

import { constants } from '../constants';

import './FieldBox.css';

const FieldBox = ({ id, style, onResize }) => {
  let height = constants.lineSize * parseInt(style.fontSize, 10);

  if (isNaN(height) || height < constants.minHeight) {
    height = constants.minHeight;
  }

  style.height = height;

  return (
    <Draggable cancel=".react-resizable-handle">
      <Resizable className="box" width={style.width} height={style.height} onResize={onResize}>
        <div className="field-box" id={id} style={style}>{i18next.t(`fields.${id}`)}</div>
      </Resizable>
    </Draggable>
  );
};

FieldBox.propTypes = {
  id:       PropTypes.string.isRequired,
  style:    PropTypes.object.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default FieldBox;
