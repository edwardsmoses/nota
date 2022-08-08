import 'react-native';
import React from 'react';
import {Toolbox} from '@components/Toolbox';
import {MMKV} from 'react-native-mmkv';

// Note: test renderer must be required after react-native.

import {fireEvent, render} from '@testing-library/react-native';
import {NOTE_PAGES_KEY} from '@storage/storage';
import {NotePage} from '@utils/types';

describe('Toolbox Tests', () => {
  let storage: MMKV;

  beforeAll(() => {
    storage = new MMKV();
  });

  it('should add a New page when the add button is pressed', () => {
    const {getByTestId} = render(<Toolbox />);

    const addButton = getByTestId('AddPage.Button');
    const pageIdLabel = getByTestId('AddPage.PageId');

    console.log(pageIdLabel.props);

    //fire the button pressed
    fireEvent.press(addButton);

    console.log(pageIdLabel.props);

    //assert 2: that a new page was added..
    // expect().toEqual(c);
  });
});
