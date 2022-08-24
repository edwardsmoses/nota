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
import {useAppSelector} from '@store/store';

const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);

export const Board = () => {
  const {currentPageKey} = useNote();

  const currentDrawToolPath = Skia.Path.Make();

  const drawViewRef = useRef<SkiaView | null>(null);

  const {tool} = useAppSelector(state => state.draw);

  const onDraw = useDrawCallback(
    (canvas, info) => {
      

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

        const drawToolPaint = Skia.Paint();

        if (tool === 'Eraser') {
          console.log('here on Eraser');

          drawToolPaint.setAntiAlias(true);
          drawToolPaint.setBlendMode(BlendMode.DstOut);

          info.touches.map(touches => {
            touches.map(touch => {
              currentDrawToolPath.moveTo(touch.x, touch.y);
              currentDrawToolPath.addCircle(touch.x, touch.y, 10);
              canvas.drawPath(currentDrawToolPath, drawToolPaint);
            });
          });
        } else if (tool === 'Pencil') {
          console.log('here on Pencil');

          drawToolPaint.setColor(Skia.Color(COLORS.LIGHT_BLACK));
          drawToolPaint.setStyle(PaintStyle.Stroke);
          drawToolPaint.setStrokeWidth(1.5);

          info.touches.map(touches => {
            touches.map(touch => {
              // currentDrawToolPath.moveTo(touch.x, touch.y);
              currentDrawToolPath.lineTo(touch.x, touch.y);
              canvas.drawPath(currentDrawToolPath, drawToolPaint);
            });
          });
        }
      }
    },
    [currentPageKey, tool],
  );

  return (
    <SkiaView
      ref={drawViewRef}
      onTouchStart={event => {
        const {
          nativeEvent: {locationX, locationY},
        } = event;
        currentDrawToolPath.moveTo(locationX, locationY);
      }}
      onTouchEnd={() => {
        console.log('are you called when touch end');
        if (drawViewRef.current) {
          // saveCanvas(drawViewRef.current?.makeImageSnapshot().encodeToBase64());
        }
      }}
      style={styles.canvas}
      onDraw={onDraw}
    />
  );
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
