/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import './fileitem.css';


/**
 * A react component which renders a file item in the file list.
 *
 * #### Notes
 * This component assumes that `fileId` exists in the store.
 */
export
function FileItem(props: FileItem.Props): ReactNode {
  // Extract the props.
  const { fileId } = props;

  // Get the file name from the store.
  const fileName = useAppStore(store => {
    // Find the file info object.
    const fileInfo = store.files.find(file => file.id === fileId)!;

    // Return the nane of the file.
    return fileInfo.name;
  });

  // Get the `deleteFile` function from the store.
  const deleteFile = useAppStore(store => store.deleteFile);

  // The callback to the handle the file delete.
  const handleClick = () => { deleteFile(fileId); };

  // Return the rendered component.
  return (
    <li className='sidebar-FileItem'>
      <span className='sidebar-FileItem-name'>
        { fileName }
      </span>
      <span className='sidebar-FileItem-delete' onClick={ handleClick }/>
    </li>
  );
}


/**
 * The namespace for the `FileItem` component statics.
 */
export
namespace FileItem {
  /**
   * A type alias for the `FileItem` props.
   */
  export
  type Props = {
    /**
     * The unique id of the file.
     */
    readonly fileId: string;
  }
}
