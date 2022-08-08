import 'react-native';
import React from 'react';
import {PageNavigator} from '@components/PageNavigator';
import {NotePage} from '@utils/types';

// Note: test renderer must be required after react-native.

import {render} from '@testing-library/react-native';

let currentPage: NotePage | null = null;

//mock the 'useNote' module response
jest.mock('@storage/storage', () => {
  return {
    __esModule: true,
    useNote: jest.fn(() => ({
      currentPage,
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

//b

//next button is disabled when it's the last page

//previous button is disabled when it's the first page

//on add, canvas is reset and drawing state is cleared

//
