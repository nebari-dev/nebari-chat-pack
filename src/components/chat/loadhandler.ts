/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ThreadMessageLike
} from '@assistant-ui/react';

import * as api from '@/api';


/**
 * A class that handles loading the session history as AUI messages.
 */
export
class LoadHandler {
  /**
   * Construct a new load handler.
   *
   * @param sessionId - The unique id for the session. If this is `undefined`,
   *   an empty message history will be loaded. If this is provided, the chat
   *   history will be loaded from the server.
   */
  constructor(sessionId: string | undefined) {
    this._sessionId = sessionId;
  }

  /**
   * Get the session id for the handler.
   */
  get sessionId(): string | undefined {
    return this._sessionId;
  }

  /**
   * Load the message history for the handler.
   *
   * @returns A promise that resolves with the AUI message history.
   */
  async loadHistory(): Promise<readonly ThreadMessageLike[]> {
    // Bail early if the session id is undefined.
    if (this._sessionId === undefined) {
      return [];
    }

    // Fetch the chat session.
    const session = await api.getSessionByID({ session_id: this._sessionId });

    // Get the chat history from the session.
    //
    // TODO get session runs instead of chat history to preserve tool calls.
    const history = session.chat_history;

    // Convert the history message to AUI messages, if possible.
    const converted = history.map(msg => this._convert(msg));

    // Return the filtered messages.
    return converted.filter(msg => msg !== null);
  }

  /**
   * Convert an Agno history message to an AUI message.
   */
  private _convert(msg: api.ChatHistoryMessage): ThreadMessageLike | null {
    if (msg.role === 'user' || msg.role === 'assistant') {
      if (typeof msg.content === 'string') {
        return {
          role: msg.role,
          content: msg.content,
          createdAt: new Date(msg.created_at)
        };
      }
    }
    console.log('unhandled history message:', msg);
    return null;
  }

  private _sessionId: string | undefined;
}
