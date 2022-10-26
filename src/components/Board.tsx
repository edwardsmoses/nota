import React, {useEffect, useRef, useState} from 'react';
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
  Group,
  Drawing,
} from '@shopify/react-native-skia';

import {storage, useNote} from 'storage/storage';
import {Annotation, DrawTool} from 'utils/types';
import {COLORS} from 'utils/colors';
import {useAppSelector} from 'store/store';

const paint = Skia.Paint();
paint.setAntiAlias(true);
paint.setBlendMode(BlendMode.Multiply);

type Touch = {
  tool: DrawTool;
  path: SkPath;
};

export const Board = () => {
  const {currentPageKey, setNotesInTransit} = useNote();

  const currentDrawToolPath = Skia.Path.Make();

  const drawViewRef = useRef<SkiaView | null>(null);

  //Canvas Ref
  const canvasRef = useCanvasRef();

  //The Path for the Drawing Board..
  let path = useRef<SkPath>(Skia.Path.Make());

  const [touchPoints, setTouchPoints] = useState<Touch[]>([]);

  useEffect(() => {
    path.current.reset();
  }, [currentPageKey]);

  // Touch handler
  const touchHandler = useTouchHandler({
    onStart: touch => {
      const {x, y} = touch;

      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);

      setTouchPoints(prev => {
        return [
          ...(prev || []),
          {
            tool,
            path: newPath,
          },
        ];
      });
    },
    onActive: touch => {
      const inProgressPath = touchPoints[touchPoints.length - 1]?.path;
      if (inProgressPath) {
        if (tool === 'Eraser') {
          inProgressPath.moveTo(touch.x, touch.y);
          inProgressPath.addCircle(touch.x, touch.y, 10);
        } else {
          currentDrawToolPath.lineTo(touch.x, touch.y);
        }
        setTouchPoints(prev => {
          return prev.map((point, index) => {
            if (index === prev.length - 1) {
              return {
                ...point,
                path: inProgressPath,
              };
            }
            return point;
          });
        });
      }
    },
    onEnd: ({}) => {
      setNotesInTransit(path.current.toSVGString());
    },
  });

  const {tool} = useAppSelector(state => state.draw);

  return (
    <Canvas style={[styles.canvas]} ref={canvasRef} onTouch={touchHandler}>
      {/*  In-progress mode */}
      <Group blendMode="multiply">
        <Drawing
          drawing={({canvas, paint: inProgressDrawPaint}) => {
            console.log('in progress', touchPoints);
            touchPoints.map(point => {
              if (point.tool === 'Eraser') {
                inProgressDrawPaint.setAntiAlias(true);
                inProgressDrawPaint.setBlendMode(BlendMode.DstOut);

                canvas.drawPath(point.path, inProgressDrawPaint);
              } else {
                inProgressDrawPaint.setColor(Skia.Color(COLORS.LIGHT_BLACK));
                inProgressDrawPaint.setStyle(PaintStyle.Stroke);
                inProgressDrawPaint.setStrokeWidth(1.5);

                canvas.drawPath(point.path, inProgressDrawPaint);
              }
            });
          }}
        />
      </Group>

      <Group blendMode="multiply">
        <Drawing
          drawing={({canvas, paint: drawingPaint}) => {
            const pathsInStorage = storage.getString(currentPageKey || '');
            let paths: Annotation[] = [];

            if (pathsInStorage) {
              paths = JSON.parse(pathsInStorage || '') as Array<Annotation>;
            }

            paths.map(annotation => {
              if (annotation && annotation.path) {
                const drawPaint = drawingPaint.copy();
                drawPaint.setColor(Skia.Color(annotation.color));
                drawPaint.setStyle(PaintStyle.Stroke);
                drawPaint.setStrokeWidth(annotation.width);

                const drawPath =
                  Skia.Path.MakeFromSVGString(annotation.path) ||
                  Skia.Path.Make();
                canvas.drawPath(drawPath, drawPaint);
              }
            });
          }}
        />
      </Group>
    </Canvas>
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
