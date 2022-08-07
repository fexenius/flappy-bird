import React from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';
import Pipe from './Pipe';

const PipeGenerator = (props) =>
  props.list.map((pipeStep, index) => (
    <Group key={index}>
      <Pipe
        x={pipeStep.top.x}
        y={pipeStep.top.y}
        width={pipeStep.top.width}
        height={pipeStep.top.height}
      />
      <Pipe
        x={pipeStep.bottom.x}
        y={pipeStep.bottom.y}
        width={pipeStep.bottom.width}
        height={pipeStep.bottom.height}
      />
    </Group>
  ));

PipeGenerator.propTypes = {
  list: PropTypes.array.isRequired
};

export default PipeGenerator;
