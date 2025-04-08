import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databaseService } from '../services/database';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  return await databaseService.getItems();
});

export const addItem = createAsyncThunk(
  'items/addItem',
  async (item) => {
    const id = await databaseService.addItem(item);
    return { ...item, id };
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async (item) => {
    await databaseService.updateItem(item);
    return item;
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id) => {
    await databaseService.deleteItem(id);
    return id;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer; 