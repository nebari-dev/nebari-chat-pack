/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * A type alias for the memories context value.
 */
export
type MemoriesContextValue = {
  /**
   * The loaded memories page from the api.
   */
  readonly page: api.MemoriesPage;

  /**
   * A function that deletes the provided memories by id.
   */
  readonly deleteMemories: (ids: readonly string[]) => Promise<void>;
};


/**
 * The memories context.
 */
export
const MemoriesContext = createContext<MemoriesContextValue | undefined>(undefined);


/**
 * A hook which returns the memories context value.
 */
export
function useMemories(): MemoriesContextValue {
  const value = useContext(MemoriesContext);
  if (value === undefined) {
    throw new Error('`useMemories` must be called within a `MemoriesContext`');
  }
  return value;
}
