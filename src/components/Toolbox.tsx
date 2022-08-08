import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {FAB, Portal, Provider} from 'react-native-paper';
import {COLORS} from '@utils/colors';
import {useNote} from '@storage/storage';

export const Toolbox = () => {
  const [open, setOpen] = useState(false);

  const {addNewPage} = useNote();

  return (
    <>
      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            visible={true}
            color={COLORS.LIGHT_BLACK}
            icon="tools"
            fabStyle={styles.groupIcon}
            actions={[
              {
                icon: 'plus',
                onPress: addNewPage,
                color: COLORS.LIGHT_BLACK,
                testID: 'AddPage.Button',
              },
            ]}
            onStateChange={state => {
              setOpen(state.open);
            }}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  groupIcon: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  hiddenText: {
    display: 'none',
  },
});
