import {MMKV, useMMKVObject, useMMKVString} from 'react-native-mmkv';
const {v4} = require('uuid');
import {Annotation, NotePage} from 'utils/types';
import {useEffect} from 'react';
import {COLORS} from 'utils/colors';
import {Skia} from '@shopify/react-native-skia';

export const storage = new MMKV();

export const NOTE_PAGES_KEY = 'nota_app_pages';
export const NOTE_CURRENT_PAGE_KEY = 'nota_app_current_page_key';
export const NOTE_IN_TRANSIT = 'nota_notes_in_transit';
export const NOTE_IMAGE_PREFIX = 'nota_notes_image_';

export const useNote = () => {
  const [currentPageKey, setCurrentPageKey] = useMMKVObject<string>(
    NOTE_CURRENT_PAGE_KEY,
  );

  const [pages, setPages] = useMMKVObject<Array<NotePage>>(NOTE_PAGES_KEY);
  const currentPageIndex = (pages || []).findIndex(
    m => m.id === currentPageKey,
  );

  /**
   * Will Hold the notes in transist.. notes that aren't yet saved to main canvas state..
   * would be saved to the main when the color changes (in future), when prev page and next page, and others..
   */
  const [notesInTransit, setNotesInTransit] = useMMKVString(NOTE_IN_TRANSIT);

  /**
   * When app loads, if there are no pages, add a default blank one..
   */
  useEffect(() => {
    if (!(pages || []).length) {
      addNewPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //concern i have with this - when working with the movable zoom canvas
  //would this scale - let's get there though...
  const saveCanvas = (imageInBase64: string) => {
    storage.set(`${NOTE_IMAGE_PREFIX}${currentPageKey || ''}`, imageInBase64);
  };

  const hasImage = () => {
    return storage.contains(`${NOTE_IMAGE_PREFIX}${currentPageKey || ''}`);
  };

  const getImage = () => {
    const drawnImage = storage.getString(
      `${NOTE_IMAGE_PREFIX}${currentPageKey || ''}`,
    );

    const imageData = Skia.Data.fromBase64(drawnImage || '');
    const image = Skia.Image.MakeImageFromEncoded(imageData);
    return image;
    // if (image) {
    //   console.log('got here');
    //   const picture = Skia.Picture.MakePicture(image.encodeToBytes());
    //   console.log('isnt null', !!picture);
    //   return picture;
    // }
    // return null;
  };

  const saveNotesInTransit = () => {
    //get the current existing paths (annotations) in storage
    const pathsInStorage = storage.getString(currentPageKey || '');

    //parse the note for the current page into an array of paths
    let paths: Annotation[] = [];
    if (pathsInStorage) {
      paths = JSON.parse(pathsInStorage || '') as Array<Annotation>;
    }
    const newPaths: Annotation[] = [
      ...(paths || []),
      {
        color: COLORS.LIGHT_BLACK, //for now, it's hardcoded, in the future, would be customizable,
        path: notesInTransit || '',
        width: 2,
      },
    ]; //add the new page..

    storage.set(currentPageKey || '', JSON.stringify(newPaths)); //stringify back..
    setNotesInTransit('');
  };

  /**
   * Add New Page
   */
  const addNewPage = () => {
    //save the current notes that are in transit
    saveNotesInTransit();

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

  /**
   * Go to Previous Page..
   */
  const goToPreviousPage = () => {
    //save the current notes that are in transit
    saveNotesInTransit();
    //get the current index of the current page, and the previous (-1);
    setCurrentPageKey((pages || [])[currentPageIndex - 1].id);
  };

  const goToNextPage = () => {
    //save the current notes that are in transit
    saveNotesInTransit();

    //get the current index of the current page, and the next (+1);
    setCurrentPageKey((pages || [])[currentPageIndex + 1].id);
  };

  return {
    addNewPage,
    currentPageKey: currentPageKey || '',
    pages,
    currentPage: (pages || []).find(m => m.id === currentPageKey),
    goToPreviousPage,
    goToNextPage,
    notesInTransit,
    setNotesInTransit,
    isUserOnFirstPage: currentPageIndex === 0,
    isUserOnLastPage: currentPageIndex === (pages || []).length - 1,
    saveCanvas,
    hasImage,
    getImage,
  };
};
