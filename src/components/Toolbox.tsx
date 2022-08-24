import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {COLORS} from '@utils/colors';
import {useNote} from '@storage/storage';
import {useDispatch} from 'react-redux';
import {drawActions} from '@store/slices/draw';

export const Toolbox = () => {
  const {addNewPage} = useNote();
  const dispatch = useDispatch();

  return (
    <View style={styles.group}>
      <IconButton
        icon="plus"
        color={COLORS.LIGHT_BLACK}
        size={28}
        style={styles.iconButton}
        testID="AddPage.Button"
        onPress={addNewPage}
      />

      <IconButton
        icon="brush"
        color={COLORS.LIGHT_BLACK}
        size={28}
        style={styles.iconButton}
        testID="PencilTool.Button"
        onPress={() => {
          dispatch(drawActions.setTool('Pencil')); //TO_DO -> Write Tests for this..
        }}
      />

      <IconButton
        icon="eraser"
        color={COLORS.LIGHT_BLACK}
        size={28}
        style={styles.iconButton}
        testID="EraserTool.Button"
        onPress={() => {
          dispatch(drawActions.setTool('Eraser'));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  group: {
    paddingRight: 10,
    flexDirection: 'row',
    display: 'flex',
  },
  hiddenText: {
    display: 'none',
  },
  iconButton: {
    paddingHorizontal: 3,
    marginHorizontal: 3,
  },
});
