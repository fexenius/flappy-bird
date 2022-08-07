import React from 'react';
import PropTypes from 'prop-types';
import { Rect } from 'react-konva';

const Pipe = (props) => {
  return (
    <Rect
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      fill="blue"
      stroke="blur"
    />
  );
};

Pipe.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

export default Pipe;
