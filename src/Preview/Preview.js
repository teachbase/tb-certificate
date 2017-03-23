import React, { PropTypes } from 'react';
import classNames from 'classnames';
import i18next from 'i18next';

import './Preview.css';

const Preview = props => {
  const {
    onChange,
    previewSrc,
    mode,
    size
  } = props;

  let content;

  if (previewSrc) {
    content = <img className="certificate-preview" src={previewSrc} alt="Certificate preview" />;
  } else {
    content = (
      <a className="link">
        {i18next.t('upload_certificate')}
      </a>
    );
  }

  const className = classNames('certificate-preview-container', {
    landscape: mode === 'landscape',
    [size.toLowerCase()]: true
  });

  return (
    <div className={className}>
      <label htmlFor="file-field">
        {content}
        <input
          onChange={onChange}
          type="file"
          name="file"
          id="file-field"
          accept="image/*"
        />
      </label>
    </div>
  );
};

Preview.propTypes = {
  onChange:   PropTypes.func.isRequired,
  previewSrc: PropTypes.string,
  mode:       PropTypes.string,
  size:       PropTypes.string,
};

Preview.defaultProps = {
  previewSrc: null,
  mode:       'portrait',
  size:       'A4'
};

export default Preview;
