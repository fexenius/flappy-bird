import React from 'react';
import PropTypes from 'prop-types';
import { Rect } from 'react-konva';

const Background = (props) => {
  return <Rect width={props.width} height={props.height} fill="white" />;
};

Background.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Background;
