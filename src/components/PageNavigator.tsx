import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {COLORS} from '@utils/colors';
import {useNote} from '@storage/storage';

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
      <IconButton
        icon="chevron-up"
        color={COLORS.LIGHT_BLACK}
        size={28}
        style={styles.iconButton}
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
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 8,
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
