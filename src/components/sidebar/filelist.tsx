/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useShallow
} from 'zustand/react/shallow';

import {
  useAppStore
} from '../../store';

import {
  FileItem
} from './fileitem';

import './filelist.css';


/**
 * A React component which renders the uploaded file list.
 */
export
function FileList(): ReactNode {
  // Fetch the file ids from the store.
  const fileIds = useAppStore(useShallow(store =>
    store.files.map(file => file.id)
  ));

  // Render the items for the files.
  const items = fileIds.map(id => {
    return <FileItem key={ id } fileId={ id } />
  });

  // Return the rendered content.
  return (
    <div className='sidebar-FileList'>
      <ul className='sidebar-FileList-list'>
        { items }
      </ul>
    </div>
  );
}
