/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

//mock the 'Board' component
jest.mock('components/Board', () => ({
  __esModule: true,
  Board: 'Board',
  DrawingBoard: 'DrawingBoard',
}));

it('App renders correctly', () => {
  renderer.create(<App />);
});
