import React, { useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { timer } from 'd3-timer';
import Bird from './components/Bird';
import Background from './components/Background';
import PipeGenerator from './components/PipeGenerator';

function Game() {
  const birdSize = 50;
  const space = 50; /// space between bird and pipe
  const pipeHeight = window.innerHeight / 2 - birdSize - space;
  const pipeWidth = 50;

  const [gameState, setGameState] = useState({
    gameStart: false,
    score: 0,
    gravity: 2,
    speed: 1,
    friction: 0.95,
    birdX: birdSize + 100,
    birdY: window.innerHeight / 2,
    birdRotation: 0,
    volocityX: 0,
    velocityY: 0,
    pipeList: [
      {
        checked: false,
        intersect: false,
        top: {
          x: window.innerWidth,
          y: 0,
          width: pipeWidth,
          height: pipeHeight
        },
        bottom: {
          x: window.innerWidth,
          y: window.innerHeight - pipeHeight,
          width: pipeWidth,
          height: pipeHeight
        }
      }
    ]
  });

  const [isClick, setIsClick] = useState(false);

  function shiftBird(state, x, y) {
    state.birdX += x;
    state.birdY -= y;
    state.birdRotation = (y <= state.gravity ? y : state.gravity) * -10;
  }

  function shiftPipe(state, index, x) {
    state.pipeList[index].top.x -= x;
    state.pipeList[index].bottom.x -= x;
  }

  function removePipe(state, pipeStep) {
    if (pipeStep.top.x + pipeStep.top.width <= 0) {
      state.pipeList.splice(0, 1);
    }
  }

  function countScore(stepState, pipeStep) {
    if (!pipeStep.intersect) {
      if (pipeStep.top.x <= stepState.birdX && !pipeStep.checked) {
        pipeStep.checked = true;
        stepState.score++;
      }
    }
  }

  const setPipe = useCallback(
    (state, x = window.innerWidth) => {
      const random = Math.floor(Math.random() * 190);

      state.pipeList.push({
        top: { x: x, y: -random, width: pipeWidth, height: pipeHeight },
        bottom: {
          x: x,
          y: window.innerHeight - pipeHeight,
          width: pipeWidth,
          height: pipeHeight
        }
      });
    },
    [pipeHeight]
  );

  const generatePipe = useCallback(
    (state, pipeStep) => {
      if (pipeStep.top.x + pipeStep.top.width <= 0) {
        setPipe(state);
      }
    },
    [setPipe]
  );

  function intersectPipe(state, pipeStep) {
    const horizontalIntersectTop = state.birdX + birdSize >= pipeStep.top.x;
    const horizontalIntersectBottom = state.birdX <= pipeStep.bottom.x + pipeStep.bottom.width;

    const verticalIntersectTop = state.birdY <= pipeStep.top.y + pipeStep.top.height;
    const verticalIntersectBottom = state.birdY + birdSize >= pipeStep.bottom.y;

    if (
      horizontalIntersectTop &&
      horizontalIntersectBottom &&
      (verticalIntersectTop || verticalIntersectBottom) &&
      !pipeStep.intersect
    ) {
      pipeStep.intersect = true;
    }
  }

  const gameStep = useCallback(() => {
    const stepState = structuredClone(gameState);

    if (isClick) {
      if (stepState.velocityY < stepState.speed + stepState.gravity * 2) {
        stepState.velocityY += 5;
      }
    }

    stepState.velocityY *= stepState.friction;
    stepState.volocityX *= stepState.friction;

    if (stepState.birdY + birdSize > window.innerHeight) {
      stepState.birdY = window.innerHeight - birdSize;
    }

    if (stepState.birdY <= birdSize) {
      stepState.birdY = birdSize;
    }

    shiftBird(stepState, 0, stepState.velocityY - stepState.gravity);

    stepState.pipeList.forEach((pipeStep, index) => {
      shiftPipe(stepState, index, 3);
      generatePipe(stepState, pipeStep, 3);
      intersectPipe(stepState, pipeStep);
      removePipe(stepState, pipeStep);

      countScore(stepState, pipeStep);
    });

    setIsClick(false);
    setGameState(stepState);
  }, [gameState, isClick, generatePipe]);

  // Game loop
  useEffect(() => {
    const timerLoop = timer(() => {
      gameStep();
    });
    return () => timerLoop.stop();
  }, [gameStep]);

  // Documnet listener (keyboard and click)
  useEffect(() => {
    const onKeypress = () => {
      setIsClick(true);
    };
    document.addEventListener('keypress', onKeypress);
    document.addEventListener('click', onKeypress);

    return () => {
      document.removeEventListener('click', onKeypress);
      document.removeEventListener('keypress', onKeypress);
    };
  }, [isClick]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Background width={window.innerWidth} height={window.innerHeight} />
        <Text
          x={20}
          y={20}
          width={150}
          height={50}
          fontSize={40}
          text={gameState.score}
          verticalAlign="middle"
        />
        <Bird
          birdRotation={gameState.birdRotation}
          x={gameState.birdX}
          y={gameState.birdY}
          birdSize={birdSize}
        />
        <PipeGenerator list={gameState.pipeList}></PipeGenerator>
      </Layer>
    </Stage>
  );
}

export default Game;
