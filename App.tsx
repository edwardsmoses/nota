import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {
  Canvas,
  Fill,
  useTouchHandler,
  Path,
  Skia,
  useCanvasRef,
  SkPath,
} from '@shopify/react-native-skia';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NOTE_KEY, storage} from './src/storage';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const canvasRef = useCanvasRef();

  let path = useRef<SkPath>(Skia.Path.Make());

  useEffect(() => {
    if (!path.current) {
      path.current =
        Skia.Path.MakeFromSVGString(storage.getString(NOTE_KEY) || '') ||
        Skia.Path.Make();
    }
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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Canvas style={styles.canvas} ref={canvasRef} onTouch={touchHandler}>
        <Fill color="white" />
        <Path
          path={path.current}
          color="lightblue"
          style={'stroke'}
          strokeWidth={3}
        />
      </Canvas>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  canvas: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FEFEFE',
  },
});

export default App;
