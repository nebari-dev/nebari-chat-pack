/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as api from '@/api';


/**
 * Fetch the sesssion summaries subject to the options.
 *
 * @params options - The options for creating the request.
 *
 * @returns The paginated session summaries according to the request.
 */
export
async function listSessions(options: api.ListSessions.Options): Promise<api.SessionsPage> {
  throw 'not implemented';
}


/**
 * Fetch the details for a particular session.
 *
 * @params options - The options that identifies the session of interest.
 *
 * @returns The details of the specified session, minus its runs. This
 *   result is useful for generating a medium-overview of the session.
 */
export
async function getSessionDetail(options: api.GetSessionDetail.Options): Promise<api.SessionDetail> {
  throw 'not implemented';
}


/**
 * Fetch the runs for a particular session.
 *
 * @params options - The options that identifies the session of interest.
 *
 * @returns A full and complete history of the session runs. This can be
 *   used to restore the full state of a session from history.
 */
export
async function getSessionRuns(options: api.GetSessionRuns.Options): Promise<readonly api.SessionRun[]> {
  return [];
}


/**
 * Create a new session run according the options.
 *
 * @param options - The options for creating the run.
 *
 * @returns An async generator that streams run events.
 */
export
async function *createRun(options: api.CreateRun.Options): AsyncGenerator<api.RunEvent> {
  throw 'not implemented';
}


/**
 * Continue a session run after a human-in-the-loop pause.
 *
 * @param options - The options for continuing the run.
 *
 * @returns An async generator that continues the run events.
 */
export
async function *continueRun(options: api.ContinueRun.Options): AsyncGenerator<api.RunEvent> {
  throw 'not implemented';
}
