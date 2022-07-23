import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  // StyleSheet,
  useColorScheme,
} from 'react-native';

import {Board} from '@components/Board';
import {Toolbox} from '@components/Toolbox';
import * as Colors from '@utils/colors';

import {Provider as PaperProvider} from 'react-native-paper';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.BLACK : Colors.WHITE,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Board />
      <Toolbox />
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
