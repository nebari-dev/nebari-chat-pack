/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useCallback, useState
} from 'react';

import * as Hrafnar from '../../hrafnar';

import {
  useAppStore
} from '../../store';

import './uploadbutton.css';


/**
 * A react component which renders the dropbox upload button.
 */
export
function UploadButton(): ReactNode {
  // Get the `uploadFiles` function from the store.
  const uploadRemoteFiles = useAppStore(store => store.uploadRemoteFiles);

  // Set up the state to track the uploading flag.
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handle click event for the upload button.
  const handleClick = useCallback(() => {
    window.Dropbox!.choose({
      linkType: 'direct',
      multiselect: true,
      extensions: ['.pdf', '.jpg', '.png'],
      success: async files => {
        // Set the uploading flag.
        setIsUploading(true);

        // Convert the dropbox files to upload specs.
        const specs = files.map(Private.convertDropboxFile);

        // Upload the files.
        await uploadRemoteFiles(specs);

        // Clear the uploading flag.
        setIsUploading(false);
      }
    });
  }, [uploadRemoteFiles]);

  // Return the rendered component.
  return (
    <button
      className='sidebar-UploadButton'
      data-uploading={ isUploading ? '' : undefined }
      onClick={ handleClick }>
      <span className='sidebar-UploadButton-icon' />
      <span className='sidebar-UploadButton-text'>
        Upload Files
      </span>
    </button>
  );
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * Convert a Dropbox `ChooserFile` to a `FileUploadSpec`.
   */
  export
  function convertDropboxFile(file: Dropbox.ChooserFile): Hrafnar.RemoteFileSpec {
    return {
      name: file.name,
      size: file.bytes,
      content_type: mapContentType(file.name),
      external_url: { path: file.link }
    };
  }

  /**
   * Map a file extension to a content MIME type.
   */
  function mapContentType(name: string): string {
    if ((/\.pdf$/i).test(name)) {
      return 'application/pdf';
    }
    if ((/\.jpg$/i).test(name)) {
      return 'image/jpeg';
    }
    if ((/\.png$/i).test(name)) {
      return 'image/png';
    }
    return 'text/plain';
  }
}
