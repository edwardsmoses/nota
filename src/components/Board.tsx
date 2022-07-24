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
  BlendMode,
  SkiaView,
  useDrawCallback,
} from '@shopify/react-native-skia';

import {storage, useNote} from '@storage/storage';

const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);

export const Board = () => {
  //Canvas Ref
  const canvasRef = useCanvasRef();

  //The Path for the Drawing Board..
  let path = useRef<SkPath>(Skia.Path.Make());

  //State for forcing re-render (used atm for when the app loads svg from storage)
  const [forceReRenderVisible, setForceReRender] = useState(false);

  const {currentPageKey} = useNote();

  useEffect(() => {
    path.current.reset();

    console.log('when are you called, it is now', currentPageKey);
    const svgString = storage.getString(currentPageKey) || '';
    // console.log(svgString);

    path.current = Skia.Path.MakeFromSVGString(svgString);

    // console.log(path.current.toSVGString());
  }, [currentPageKey]);

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
      path.current.close();
      storage.set(currentPageKey, path.current.toSVGString());
    },
  });

  const width = 256;
  const height = 256;
  const r = 92;

  const onDraw = useDrawCallback(canvas => {
    // Cyan Circle
    const cyan = paint.copy();
    cyan.setColor(Skia.Color('cyan'));
    canvas.drawCircle(r, r, r, cyan);
    // Magenta Circle
    const magenta = paint.copy();
    magenta.setColor(Skia.Color('magenta'));
    canvas.drawCircle(width - r, r, r, magenta);
    // Yellow Circle
    const yellow = paint.copy();
    yellow.setColor(Skia.Color('yellow'));
    canvas.drawCircle(width / 2, height - r, r, yellow);
  });

  return <SkiaView style={styles.canvas} onDraw={onDraw} />;
};

const styles = StyleSheet.create({
  canvas: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FEFEFE',
  },
});
