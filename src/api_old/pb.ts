/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import PocketBase from 'pocketbase';


/**
 * A singleton `PocketBase` instance to be used by the entire application.
 */
export
const pb = new PocketBase(import.meta.env.VITE_PB_URL);
