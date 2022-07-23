import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Canvas,
  Fill,
  useTouchHandler,
  Path,
  Skia,
  useCanvasRef,
  SkPath,
} from '@shopify/react-native-skia';

import {NOTE_KEY, storage} from '@storage/';

export const Board = () => {
  //Canvas Ref
  const canvasRef = useCanvasRef();

  //The Path for the Drawing Board..
  let path = useRef<SkPath>(Skia.Path.Make());

  //State for forcing re-render (used atm for when the app loads svg from storage)
  const [, setForceReRender] = useState(false);

  useEffect(() => {
    const svgString = storage.getString(NOTE_KEY) || '';
    path.current = Skia.Path.MakeFromSVGString(svgString) || Skia.Path.Make();
    setForceReRender(true);
  }, []);

  // Touch handler
  const touchHandler = useTouchHandler({
    onStart: touch => {
      const {x, y} = touch;
      path.current.moveTo(x, y);
    },
    onActive: touch => {
      const {x, y} = touch;
      path.current.lineTo(x, y);
    },
    onEnd: ({}) => {
      storage.set(NOTE_KEY, path.current.toSVGString());
    },
  });

  return (
    <Canvas style={styles.canvas} ref={canvasRef} onTouch={touchHandler}>
      <Fill color="white" />
      <Path
        path={path.current}
        color="lightblue"
        style={'stroke'}
        strokeWidth={3}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FEFEFE',
  },
});
