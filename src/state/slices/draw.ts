import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DrawState, DrawTool} from '@utils/types';

const initialState: DrawState = {
  tool: 'Pencil',
};

const drawSlice = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<DrawTool>) => {
      state.tool = action.payload;
    },
  },
});

const drawReducer = drawSlice.reducer;
const drawActions = drawSlice.actions;

export {drawReducer, drawActions};
