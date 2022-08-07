import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Group } from 'react-konva';

const Bird = (props) => {
  return (
    <Group rotation={props.birdRotation} x={props.x} y={props.y}>
      <Circle stroke="black" radius={props.birdSize} />
      <Circle x={props.birdSize} y={props.birdSize / 2 - 20} fill="red" stroke="red" radius={20} />
    </Group>
  );
};

Bird.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  birdRotation: PropTypes.number.isRequired,
  birdSize: PropTypes.number.isRequired
};

export default Bird;
