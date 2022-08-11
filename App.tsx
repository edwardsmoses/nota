import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  // StyleSheet,
  useColorScheme,
} from 'react-native';

import {Board, DrawingBoard} from '@components/Board';
import {Toolbox} from '@components/Toolbox';
import {PageNavigator} from '@components/PageNavigator';
import {COLORS} from '@utils/colors';

import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Board />
      {/* <DrawingBoard /> */}
      <Toolbox />
      <PageNavigator />
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({});

const Main = () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
};

export default Main;
