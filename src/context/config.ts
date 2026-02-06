/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * The api config context.
 */
export
const ConfigContext = createContext<api.Config | undefined>(undefined);


/**
 * A hook which returns the api config.
 */
export
function useConfig(): api.Config {
  const config = useContext(ConfigContext);
  if (config === undefined) {
    throw new Error('`useConfig` must be called within a `ConfigContext`');
  }
  return config;
}
