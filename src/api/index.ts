/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  GetConfig
} from './config';

import type {
  GetMemories
} from './memory';

import type {
  GetMetrics
} from './metrics';

import type {
  CreateRun, ContinueRun, GetSessionDetail, GetSessionRuns, ListSessions
} from './session';


// Re-export the types from the sub-modules.
export * from './config';
export * from './memory';
export * from './metrics';
export * from './session';


/**
 * A type alias of all the api handlers.
 */
export
type Handlers = {
  readonly getConfig: GetConfig;
  readonly getMemories: GetMemories;
  readonly getMetrics: GetMetrics;
  readonly listSessions: ListSessions;
  readonly getSessionDetail: GetSessionDetail;
  readonly getSessionRuns: GetSessionRuns;
  readonly createRun: CreateRun;
  readonly continueRun: ContinueRun;
};
