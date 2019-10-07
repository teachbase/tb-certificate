import React, { PropTypes } from 'react';
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';

import { constants } from '../constants';

import './FieldBox.css';

const FieldBox = ({ id, text, style, onResize }) => {
  let height = constants.lineSize * parseInt(style.fontSize, 10);

  if (isNaN(height) || height < constants.minHeight) {
    height = constants.minHeight;
  }

  style.height = height;

  // Have to be removed later
  if (style.width === '50%') {
    const well = document.querySelector(`#${id}`);
    const padding = 2 * parseInt(getComputedStyle(well).padding, 10);
    style.width = (well.clientWidth - padding) / 2;
  }

  return (
    <Draggable cancel=".react-resizable-handle">
      <Resizable className="box" width={style.width} height={style.height} onResize={onResize}>
        <div className="field-box" id={id} style={style}>{text}</div>
      </Resizable>
    </Draggable>
  );
};

FieldBox.propTypes = {
  id:       PropTypes.string.isRequired,
  text:     PropTypes.string.isRequired,
  style:    PropTypes.object.isRequired,
  onResize: PropTypes.func.isRequired,
};

export default FieldBox;
