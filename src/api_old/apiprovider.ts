/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import {
  API
} from './api';


/**
 * The API provider.
 */
export
const APIProvider = createContext<API | undefined>(undefined);


/**
 * A hook which returns the api
 */
export
function useAPI(): API {
  const api = useContext(APIProvider);
  if (api === undefined) {
    throw new Error('missing `APIProvider`');
  }
  return api;
}
