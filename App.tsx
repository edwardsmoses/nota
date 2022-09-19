import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  // StyleSheet,
  useColorScheme,
} from 'react-native';

import {Board} from 'components/Board';
import {PageNavigator} from 'components/PageNavigator';
import {COLORS} from 'utils/colors';
import {Provider} from 'react-redux';
import {store} from 'store/store';

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
      <PageNavigator />
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({});

const Main = () => {
  return (
    <PaperProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </PaperProvider>
  );
};

export default Main;
