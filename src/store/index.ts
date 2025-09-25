/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  create
} from 'zustand';

import type {
  ChatsSlice
} from './chats';

import {
  createChatsSlice
} from './chats';

import type {
  FilesSlice
} from './files';

import {
  createFilesSlice
} from './files';

import type {
  InfoSlice
} from './info';

import {
  createInfoSlice
} from './info';

import type {
  UISlice
} from './ui';

import {
  createUISlice
} from './ui';

export * from './chats';
export * from './files';
export * from './info';
export * from './ui';


/**
 * A type alias for the application state and action.
 */
export
type AppStore = ChatsSlice & FilesSlice & InfoSlice & UISlice & {
  /**
   * Initialize the store from the server state.
   */
  initialize: () => Promise<void>;
};


/**
 * The global application store.
 */
export
const useAppStore = create<AppStore>((set, get, api) => ({
  // Include the store slices.
  ...createChatsSlice(set, get, api),
  ...createFilesSlice(set, get, api),
  ...createInfoSlice(set, get, api),
  ...createUISlice(set, get, api),

  // Initialize the store from the server state.
  initialize: async () => {
    // Initialize the info.
    await get().initializeInfo();

    // Initialize the files.
    await get().initializeFiles();

    // Initialize the chats.
    await get().initializeChats();
  }
}));
