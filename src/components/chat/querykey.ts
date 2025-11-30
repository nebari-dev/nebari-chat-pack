/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/


/**
 * A well-defined query key for the chat endpoint.
 */
export
type QueryKey = readonly ['chat', string];


/**
 * A query key for a new chat which doesn't yet have a session.
 */
export
type NullQueryKey = readonly ['chat', undefined];


/**
 * A query key which may or may not have a session.
 */
export
type MaybeQueryKey = readonly ['chat', string | undefined];


/**
 * A function that creates a chat query key for a session.
 */
export
function createQueryKey(session_id: string): QueryKey;
export
function createQueryKey(session_id: undefined): NullQueryKey;
export
function createQueryKey(session_id: string | undefined): MaybeQueryKey
export
function createQueryKey(session_id: string | undefined): MaybeQueryKey {
  return ['chat', session_id];
}
