import {MMKV, useMMKVObject} from 'react-native-mmkv';
const {v4} = require('uuid');
import {NotePage} from '@utils/types';
import {useEffect} from 'react';

export const storage = new MMKV();

export const NOTE_PAGES_KEY = 'nota_app_pages';
export const NOTE_CURRENT_PAGE_KEY = 'nota_app_current_page_key';

export const useNote = () => {
  const [currentPageKey, setCurrentPageKey] = useMMKVObject<string>(
    NOTE_CURRENT_PAGE_KEY,
  );

  const [pages, setPages] = useMMKVObject<Array<NotePage>>(NOTE_PAGES_KEY);

  console.log('nota pages', pages, currentPageKey);

  /**
   * When app loads, if there are no pages, add a default blank one..
   */
  useEffect(() => {
    if (!(pages || []).length) {
      addNewPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Add New Page
   */
  const addNewPage = () => {
    const newPage: NotePage = {
      dateCreated: new Date().valueOf(),
      id: `nota_${v4()}`,
      label: `New Page - ${new Date().toLocaleDateString('en-us', {
        weekday: 'long',
      })}`,
    };

    setPages([...(pages || []), newPage]);
    setCurrentPageKey(newPage.id);
  };

  return {addNewPage, currentPageKey: currentPageKey || ''};
};
