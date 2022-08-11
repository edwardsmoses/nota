import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  Canvas,
  useTouchHandler,
  Path,
  Skia,
  useCanvasRef,
  SkPath,
  BlendMode,
  SkiaView,
  useDrawCallback,
  PaintStyle,
} from '@shopify/react-native-skia';

import {storage, useNote} from '@storage/storage';
import {Annotation} from '@utils/types';
import {COLORS} from '@utils/colors';

const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);

export const Board = () => {
  const {currentPageKey} = useNote();

  const eraserPath = Skia.Path.Make();

  const onDraw = useDrawCallback(
    (canvas, info) => {
      console.log('is called');

      const pathsInStorage = storage.getString(currentPageKey || '');
      let paths: Annotation[] = [];
      if (pathsInStorage) {
        paths = JSON.parse(pathsInStorage || '') as Array<Annotation>;
      }

      paths.map(annotation => {
        if (annotation && annotation.path) {
          const drawPaint = paint.copy();
          drawPaint.setColor(Skia.Color(annotation.color));
          drawPaint.setStyle(PaintStyle.Stroke);
          drawPaint.setStrokeWidth(annotation.width);

          const drawPath =
            Skia.Path.MakeFromSVGString(annotation.path) || Skia.Path.Make();
          canvas.drawPath(drawPath, drawPaint);
        }
      });

      if (info.touches) {
        console.log('is called only on touches', info.touches);

        const eraserPaint = Skia.Paint();
        eraserPaint.setAntiAlias(true);
        eraserPaint.setBlendMode(BlendMode.DstOut);

        info.touches.map(touches => {
          touches.map(touch => {
            eraserPath.moveTo(touch.x, touch.y);
            eraserPath.addCircle(touch.x, touch.y, 10);
            canvas.drawPath(eraserPath, eraserPaint);
          });
        });
      }
    },
    [currentPageKey],
  );

  return <SkiaView style={styles.canvas} onDraw={onDraw} />;
};

export const DrawingBoard = () => {
  //Canvas Ref
  const canvasRef = useCanvasRef();

  //The Path for the Drawing Board..
  let path = useRef<SkPath>(Skia.Path.Make());

  const {setNotesInTransit, currentPageKey} = useNote();

  useEffect(() => {
    path.current.reset();
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
      setNotesInTransit(path.current.toSVGString());
    },
  });

  return (
    <Canvas
      style={[styles.canvas, styles.drawingCanvas]}
      ref={canvasRef}
      onTouch={touchHandler}>
      <Path
        path={path.current}
        color={COLORS.LIGHT_BLACK}
        style={'stroke'}
        strokeWidth={2}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  canvas: {
    height: '100%',
    width: '100%',
  },
  drawingCanvas: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    display: 'flex',
  },
});
