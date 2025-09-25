/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/


/**
 * A type alias for an available `Model` on the server.
 */
export
type Model = {
  /**
   * The unique name for the model.
   */
  readonly name: string;

  /**
   * The human readable name of the model.
   */
  readonly display_name: string;

  /**
   * Whether the model supports file attachments.
   */
  readonly supports_files: boolean;

  /**
   * Whether the model supports tool calling.
   */
  readonly supports_tool_calls: boolean;
};


/**
 * A type alias for an available `Tool` on the server.
 */
export
type Tool = {
  /**
   * The unique name for the tool.
   */
  readonly name: string;

  /**
   * The human readable name of the tool.
   */
  readonly display_name: string;

  /**
   * A description of tool's functionality.
   */
  readonly description: string;
};


/**
 * A type alias for an `Info` response from the server.
 */
export
type Info = {
  /**
   * The available models.
   */
  readonly models: readonly Model[];

  /**
   * The available tools.
   */
  readonly toolsets: readonly Tool[];
};


/**
 * Get the model and tool info from Hrafnar.
 *
 * @returns An `Info` object detailing the available models and tools.
 */
export
async function getInfo(): Promise<Info> {
  // Fetch the info.
  const response = await fetch('/api/info', {
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
  return await response.json() as Info;
}
