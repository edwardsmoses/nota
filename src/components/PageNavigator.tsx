import {StyleSheet, View, Text} from 'react-native';
import React from 'react';
import {IconButton} from 'react-native-paper';
import {COLORS} from '@utils/colors';

export const PageNavigator = () => {
  return (
    <View style={styles.topRow}>
      <IconButton
        icon="chevron-up"
        color={COLORS.LIGHT_BLACK}
        size={28}
        style={styles.iconButton}
        onPress={() => console.log('Pressed')}
      />
      <Text style={styles.titleLabel}>Note Page 1</Text>
      <IconButton
        icon="chevron-down"
        color={COLORS.LIGHT_BLACK}
        size={28}
        onPress={() => console.log('Pressed')}
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
