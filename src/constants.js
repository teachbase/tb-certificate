const defaultStyle = {
  width: '50%',
  height: 15,
  fontSize: '12px',
  color: '#000000',
  textAlign: 'center',
};

export default [
  {
    id: 'score',
  },
  {
    id: 'score_percent',
  },
  {
    id: 'session_dates',
  },
  {
    id: 'finished_at',
  },
  {
    id: 'cert_uuid',
  },
  {
    id: 'fullname',
  },
  {
    id: 'course_name',
  },
  {
    id: 'email',
  },
  {
    id: 'expired_at',
  },
].reduce((prev, { id }) => {
  prev[id] = {
    chosen: false,
    style: defaultStyle
  };

  return prev;
}, {});

export const constants = {
  maxFontSize: 64,
  minHeight: 8,
  lineSize: 1.44 // lineHeight/fontSize
};
