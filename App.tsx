import React from 'react';
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
} from '@shopify/react-native-skia';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const canvasRef = useCanvasRef();

  const path = Skia.Path.Make();

  // Touch handler
  const touchHandler = useTouchHandler({
    onStart: touch => {
      const {x, y} = touch;
      path.moveTo(x, y);
    },
    onActive: touch => {
      const {x, y} = touch;
      path.lineTo(x, y);
    },
    onEnd: ({}) => {},
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Canvas style={styles.canvas} ref={canvasRef} onTouch={touchHandler}>
        <Fill color="white" />
        <Path path={path} color="lightblue" style={'stroke'} strokeWidth={3} />
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
