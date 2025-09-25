/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/


/**
 * A type alias for a `FileInfo` object.
 */
export
type FileInfo = {
  /**
   * The server-generated unique id of the file.
   */
  readonly id: string;

  /**
   * The MIME type of the file contents.
   */
  readonly content_type: string;

  /**
   * The size of the file, in bytes.
   */
  readonly size: number;

  /**
   * The name of the file.
   */
  readonly name: string;
};


/**
 * A type alias for a `RemoteFileSpec`.
 */
export
type RemoteFileSpec = {
  /**
   * The MIME type of the file contents.
   */
  readonly content_type: string;

  /**
   * The size of the file, in bytes.
   */
  readonly size: number;

  /**
   * The name of the file.
   */
  readonly name: string;

  /**
   * The external URL where the server can download the file.
   */
  readonly external_url: { readonly path: string };
};


/**
 * Get the existing files from the server.
 *
 * @returns The file info objects for the available files.
 */
export
async function getFiles(): Promise<readonly FileInfo[]> {
  // Fetch the info.
  const response = await fetch('/api/files', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: null
  });

  // Throw an error if the request failed.
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Parse the response.
  return await response.json() as FileInfo[];
}


/**
 * Upload remote files to the server.
 *
 * @param specs - The upload specs for the remote files.
 *
 * @returns The file info objects for the uploaded files.
 */
export
async function uploadRemoteFiles(
  specs: readonly RemoteFileSpec[]
): Promise<readonly FileInfo[]> {
  // Post the request.
  const response = await fetch('/api/files/register', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(specs)
  });

  // Throw an error if the request failed.
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Parse the response.
  return await response.json() as FileInfo[];
}


/**
 * Delete a file on the server.
 *
 * @param id - The unique id of the file to delete.
 */
export
async function deleteFile(id: string): Promise<void> {
  // Post the request.
  const response = await fetch(`/api/files/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: null
  });

  // Throw an error if the request failed.
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}
