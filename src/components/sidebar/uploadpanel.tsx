/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import {
  FileList
} from './filelist';

import {
  UploadButton
} from './uploadbutton';

import './uploadpanel.css';


/**
 * A React component that renders the file upload panel in the sidebar.
 */
export
function UploadPanel(): ReactNode {
  // Extract the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Return the rendered component.
  return (
    <div className='sidebar-UploadPanel' data-state={ sideBarState }>
      <FileList />
      <UploadButton />
    </div>
  );
}
