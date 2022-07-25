/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('@shopify/react-native-skia', () => ({
  Skia: {
    Paint: () => {
      return {
        setAntiAlias: jest.fn(),
        setBlendMode: jest.fn(),
      };
    },
  },
  BlendMode: {},
}));

it('renders correctly', () => {
  renderer.create(<App />);
});
