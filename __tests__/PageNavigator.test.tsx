import 'react-native';
import React from 'react';
import {PageNavigator} from '@components/PageNavigator';
import {NotePage} from '@utils/types';

// Note: test renderer must be required after react-native.

import {fireEvent, render} from '@testing-library/react-native';

let currentPage: NotePage | null = null;
let isUserOnLastPage: boolean = false;
let wasNextButtonFired: boolean = false;
let isUserOnFirstPage: boolean = false;
let wasLastButtonFired: boolean = false;

//mock the 'useNote' module response
jest.mock('@storage/storage', () => {
  return {
    __esModule: true,
    useNote: jest.fn(() => ({
      currentPage,
      isUserOnLastPage,
      isUserOnFirstPage,
      goToNextPage: jest.fn(() => {
        wasNextButtonFired = true;
      }),
      goToPreviousPage: jest.fn(() => {
        wasLastButtonFired = true;
      }),
    })),
  };
});

it('should render nothing when current page is not present ', () => {
  const {container} = render(<PageNavigator />);
  expect(container.children.length).toBe(0);
});

it('should render the page title', () => {
  currentPage = {dateCreated: 0, id: '', label: 'Test Page'};
  const {getAllByText} = render(<PageNavigator />);
  expect(getAllByText('Test Page').length).toBe(1);
});

it('should disable the Next button when user is on the last page', () => {
  //act that user is on last page
  isUserOnLastPage = true;

  const {getByTestId} = render(<PageNavigator />);

  //get the next button..
  const button = getByTestId('Next.Button');

  //assert 1: that button is disabled prop.. (disabled isn't showing in the props -- figure out why)
  expect(button.props.accessibilityState.disabled).toEqual(true);

  //fire the button pressed
  fireEvent.press(button);

  //assert 2: that the state 'wasNextButtonFired' remains as false
  expect(wasNextButtonFired).toEqual(false);
});

it('should disable the Previous button when user is on the first page', () => {
  //act that user is on first page
  isUserOnFirstPage = true;

  const {getByTestId} = render(<PageNavigator />);

  //get the next button..
  const button = getByTestId('Previous.Button');

  //assert 1: that button is disabled prop.. (disabled isn't showing in the props -- figure out why)
  expect(button.props.accessibilityState.disabled).toEqual(true);

  //fire the button pressed
  fireEvent.press(button);

  //assert 2: that the state 'wasNextButtonFired' remains as false
  expect(wasLastButtonFired).toEqual(false);
});

//on add, canvas is reset and drawing state is cleared
