import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IconButton, Text} from 'react-native-paper';
import {COLORS} from '@utils/colors';
import {useNote} from '@storage/storage';
import {Toolbox} from './Toolbox';

export const PageNavigator = () => {
  const {
    currentPage,
    isUserOnFirstPage,
    isUserOnLastPage,
    goToNextPage,
    goToPreviousPage,
  } = useNote();

  if (!currentPage) {
    return null;
  }

  return (
    <View style={styles.topRow}>
      <View style={styles.leftRow}>
        <IconButton
          icon="chevron-up"
          color={COLORS.LIGHT_BLACK}
          size={28}
          style={styles.iconButton}
          testID="Previous.Button"
          disabled={isUserOnFirstPage}
          onPress={goToPreviousPage}
        />
        <Text style={styles.titleLabel}>{currentPage.label}</Text>
        <IconButton
          icon="chevron-down"
          color={COLORS.LIGHT_BLACK}
          size={28}
          disabled={isUserOnLastPage}
          onPress={goToNextPage}
          testID="Next.Button"
          style={styles.iconButton}
        />
      </View>

      <Toolbox />
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 8,
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  leftRow: {
    flexDirection: 'row',
    display: 'flex',
  },

  iconButton: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  titleLabel: {
    alignItems: 'center',
    textAlign: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
