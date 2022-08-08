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

    let currentPagesLength = 0;

    //get the current page length
    try {
      currentPagesLength = (
        JSON.parse(storage.getString(NOTE_PAGES_KEY) || '') as Array<NotePage>
      ).length;
    } catch (error) {}

    const addButton = getByTestId('AddPage.Button');

    //fire the button pressed
    fireEvent.press(addButton);

    let newPagesLength = 0;

    //get the current page length
    try {
      newPagesLength = (
        JSON.parse(storage.getString(NOTE_PAGES_KEY) || '') as Array<NotePage>
      ).length;
    } catch (error) {}

    //assert 2: that a new page was added..
    expect(newPagesLength).toEqual(currentPagesLength + 1);
  });
});
