/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';

import * as api from '@/api';


// The schema for the Agno detail detail.
const agentDetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.fallback(v.string(), '')
});


// The schema for an Agno OS config.
const appConfigSchema = v.object({
  os_id: v.string(),
  agents: v.array(agentDetailSchema),
  name: v.fallback(v.string(), '')
});


// A schema for Agno token metrics.
const tokenMetricsSchema = v.object({
  input_tokens: v.number(),
  output_tokens: v.number(),
  total_tokens: v.number(),
});


// A type alias for an agno token metrics row.
type TokenMetrics = v.InferOutput<typeof tokenMetricsSchema>;


// A schema for Agno model metrics.
const modelMetricsSchema = v.object({
  model_id: v.string(),
  model_provider: v.string(),
  count: v.number(),
});


// A type alias for an agno model metrics row.
type ModelMetrics = v.InferOutput<typeof modelMetricsSchema>;


// A schema for an agno app metrics row.
const appMetricsRowSchema = v.object({
  agent_runs_count: v.number(),
  agent_sessions_count: v.number(),
  token_metrics: tokenMetricsSchema,
  model_metrics: v.array(modelMetricsSchema),
  updated_at: v.string(),
});


// A schmea for an agno app metrics result.
const appMetricsSchema = v.object({
  metrics: v.array(appMetricsRowSchema)
});


// A schema for an Agno sessions list item.
const sessionInfoSchema = v.object({
  session_id: v.string(),
  session_name: v.string(),
  created_at: v.string(),
  updated_at: v.string()
});


// A type alias for an Agno session info.
type SessionInfo = v.InferOutput<typeof sessionInfoSchema>;


// A schema for an Agno list sessions response.
const listSessionsSchema = v.object({
  data: v.array(sessionInfoSchema),
});


// A schema for a chat history message.
const chatHistoryMessageSchema = v.object({
  role: v.union([
    v.literal('user'),
    v.literal('assistant')
  ]),
  created_at: v.number(),
  content: v.fallback(v.string(), '')
});


// A type alias for an Agno chat history message.
type ChatHistoryMessage = v.InferOutput<typeof chatHistoryMessageSchema>;


// A schema for an `agent` session.
const sessionDetailSchema = v.object({
  ...sessionInfoSchema.entries,
  metrics: tokenMetricsSchema,
  agent_data: v.object({
    name: v.string(),
    agent_id: v.string(),
    model: v.object({
      id: v.string(),
      name: v.string(),
      provider: v.string()
    })
  }),
  chat_history: v.array(chatHistoryMessageSchema)
});


// A schema for an Agno memory info.
const memoryInfoSchema = v.object({
  memory_id: v.string(),
  memory: v.string(),
  topics: v.array(v.string()),
  agent_id: v.string(),
  team_id: v.nullable(v.string()),
  user_id: v.string(),
  updated_at: v.string(),
});


// A type alias for an Agno memory info.
type MemoryInfo = v.InferOutput<typeof memoryInfoSchema>;


// A schema for an Agno memories response.
const memoriesSchema = v.object({
  data: v.array(memoryInfoSchema)
});


// A schema for the Agno `RunStarted` event.
const runStartedEventSchema = v.object({
  event: v.literal('RunStarted'),
  agent_id: v.string(),
  agent_name: v.string(),
  created_at: v.number(),
  model: v.string(),
  model_provider: v.string(),
  run_id: v.string(),
  session_id: v.string()
});


// A schema for the Agno `RunContent` event.
const runContentEventSchema = v.object({
  event: v.literal('RunContent'),
  agent_id: v.string(),
  agent_name: v.string(),
  content: v.string(),
  content_type: v.string(),
  created_at: v.number(),
  reasoning_content: v.string(),
  run_id: v.string(),
  session_id: v.string()
});


// A schema for a user input.
const userInputSchemaSchema = v.object({
  name: v.string(),
  field_type: v.string(),
  description: v.string(),
  value: v.any()
});


// A schema for an Agno tool execution.
const toolExecutionSchema = v.object({
  confirmation_note: v.nullish(v.string()),
  confirmed: v.nullish(v.boolean()),
  created_at: v.number(),
  external_execution_required: v.nullish(v.boolean()),
  requires_confirmation: v.nullish(v.boolean()),
  requires_user_input: v.nullish(v.boolean()),
  tool_args: v.looseObject({}),
  tool_call_id: v.string(),
  tool_name: v.string(),
  user_input_schema: v.nullish(v.array(userInputSchemaSchema))
});


// A schema for the Agno `RunPaused` event.
const runPausedEventSchema = v.object({
  event: v.literal('RunPaused'),
  agent_id: v.string(),
  agent_name: v.string(),
  content: v.string(),
  created_at: v.number(),
  run_id: v.string(),
  session_id: v.string(),
  tools: v.array(toolExecutionSchema)
});


// A schema for Agno run metrics.
const runMetricsSchema = v.object({
  duration: v.number(),
  input_tokens: v.number(),
  output_tokens: v.number(),
  time_to_first_token: v.number(),
  total_tokens: v.number()
});


// A schema for the Agno `RunCompleted` event.
const runCompletedEventSchema = v.object({
  event: v.literal('RunCompleted'),
  agent_id: v.string(),
  agent_name: v.string(),
  content: v.string(),
  content_type: v.string(),
  created_at: v.number(),
  metrics: runMetricsSchema,
  run_id: v.string(),
  session_id: v.string()
});


// The schema for a tool call.
const toolCallSchema = v.object({
  created_at: v.number(),
  result: v.nullish(v.string()),
  tool_call_id: v.string(),
  tool_name: v.string(),
  tool_args: v.looseObject({})
});


// The common schema for tool call events.
const toolCallEventCommonSchema = v.object({
  agent_id: v.string(),
  agent_name: v.string(),
  created_at: v.number(),
  run_id: v.string(),
  session_id: v.string(),
  tool: toolCallSchema
});


// A schema for the Agno `ToolCallStarted` event.
const toolCallStartedEventSchema = v.object({
  ...toolCallEventCommonSchema.entries,
  event: v.literal('ToolCallStarted')
});


// A schema for the Agno `ToolCallCompleted` event.
const toolCallCompletedEventSchema = v.object({
  ...toolCallEventCommonSchema.entries,
  event: v.literal('ToolCallCompleted'),
  content: v.string()
});


// A schema for the ignored Agno events.
const ignoredEventsSchema = v.object({
  event: v.union([
    v.literal('RunContinued'),
    v.literal('RunContentCompleted'),
    v.literal('ModelRequestStarted'),
    v.literal('ModelRequestCompleted'),
    v.literal('ToolCallError'),
    v.literal('CustomEvent')
  ])
});


// A schema variant of the Agno run events.
const runEventSchema = v.variant('event', [
  runStartedEventSchema,
  runContentEventSchema,
  runPausedEventSchema,
  runCompletedEventSchema,
  toolCallStartedEventSchema,
  toolCallCompletedEventSchema,
  ignoredEventsSchema
]);


// A type alias for the Agno run events union.
type RunEvent = v.InferOutput<typeof runEventSchema>;


// A schema for an Agno session run.
const sessionRunSchema = v.object({
  agent_id: v.string(),
  created_at: v.string(),
  events: v.array(runEventSchema),
  run_id: v.string(),
  run_input: v.string(),
  updated_at: v.string()
});


// A type alias for an Agno session run.
type SessionRun = v.InferOutput<typeof sessionRunSchema>;


// A schema for the Agno session runs.
const sessionRunsSchema = v.array(sessionRunSchema);


/**
 * An implementation of the Chat++ interface for the Agno api.
 */
export
class AgnoAPI implements api.CppAPI {
  /**
   * The base URL for the Agno OS endpoint.
   */
  readonly baseURL: string;

  /**
   * The auth token for the logged-in user.
   */
  readonly authToken: string;

  /**
   * Construct a new Agno API instance.
   *
   * @params baseURL - The base URL for the Agno OS endpoint.
   */
  constructor(baseURL: string, authToken: string) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  /**
   * Fetch the overall application config object.
   *
   * This defines the top-level application configuration which, among other
   * things, defines which agents are available to the application.
   *
   * @returns The global application configuration object.
   */
  async getAppConfig(): Promise<api.AppConfig> {
    // Fetch the Agno OS config schema.
    const resp = await fetch(`${this.baseURL}/config`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against request failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to json.
    const json = await resp.json();

    // Parse the Agno reponse.
    const config = v.parse(appConfigSchema, json);

    // Map the agno agents to the API.
    const agents = config.agents.map(agent => ({
      agentId: agent.id,
      agentName: agent.name,
      description: agent.description,
      quickPrompts: [],  // TODO - quick prompts
    })) as readonly api.AgentDetail[];

    // Return the translated result.
    return {
      appId: config.os_id,
      appName: config.name,
      agents: agents
    };
  }

  /**
   * Fetch the aggregate application metrics.
   *
   * @params options - The options to specify the time range for the query.
   *
   * @returns The aggregate metrics results for the requested time range.
   */
  async getAppMetrics(options: api.GetAppMetricsOptions): Promise<api.GetAppMetricsResult> {
    // Extract the options.
    const { startDate, endDate } = options;

    // Create the search params for the request.
    const params = new URLSearchParams();

    // Add the requested date range to the search params.
    if (startDate) {
      params.append('starting_date', startDate);
    }
    if (endDate) {
      params.append('ending_date', endDate);
    }

    // Ensure the metrics are up-to-date.
    //
    // TODO - if this POST becomes a performance problem, we may need to
    // implement a caching strategy, refresh on a timer, etc.
    await fetch('/api/metrics/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Fetch the Agno OS config schema.
    const resp = await fetch(`${this.baseURL}/metrics?${params}`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against request failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to json.
    const json = await resp.json();

    // Parse the agno response.
    const parsed = v.parse(appMetricsSchema, json);

    // Translate the token metrics.
    const tokenMetrics = parsed.metrics.map(row => {
      return {
        date: row.updated_at,
        runsCount: row.agent_runs_count,
        sessionsCount: row.agent_sessions_count,
        tokenMetrics: Private.convertTokenMetrics(row.token_metrics)
      };
    }) as api.AppTokenMetricsRow[];

    // Translate the model metrics
    const modelMetrics = parsed.metrics.map(row => {
      return {
        date: row.updated_at,
        modelMetrics: row.model_metrics.map(mm =>
          Private.convertModelMetrics(mm)
        )
      };
    }) as api.AppModelMetricsRow[];

    // Return the translated result.
    return { tokenMetrics, modelMetrics };
  }

  /**
   * Fetch the sesssion summaries subject to the options.
   *
   * @params options - The options for creating the request.
   *
   * @returns The paginated session summaries according to the results.
   */
  async listSessions(_options: api.ListSessionsOptions): Promise<api.ListSessionsResult> {
    // Ignore the options and pagination for Agno for now.
    //
    // Not worth implementing if we are gonna ditch Agno.

    // Fetch the Agno OS config schema.
    const resp = await fetch(`${this.baseURL}/sessions?type=agent&sort_by=updated_at`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against request failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to JSON.
    const json = await resp.json();

    // Parse the agno response.
    const parsed = v.parse(listSessionsSchema, json);

    // Return the translated result.
    //
    // Ignore pagination for now.
    return {
      limit: parsed.data.length,
      page: 0,
      pageCount: 1,
      totalCount: parsed.data.length,
      sessions: parsed.data.map(Private.convertSessionInfo)
    };
  }

  /**
   * Fetch the details for a particular session.
   *
   * @params options - The options that identifies the session of interest.
   *
   * @returns The details of the specified session, minus its runs. This
   *   result is useful for generating a medium-overview of the session.
   */
  async getSession(options: api.GetSessionOptions): Promise<api.SessionDetail> {
    // Extract the options.
    const { sessionId } = options;

    // Fetch the resource.
    const resp = await fetch(`${this.baseURL}/sessions/${sessionId}?type=agent`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against fetch failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to JSON.
    const json = await resp.json();

    // Parse the agno response.
    const parsed = v.parse(sessionDetailSchema, json);

    // Return the translated result.
    return {
      sessionId: parsed.session_id,
      sessionName: parsed.session_name,
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
      agentId: parsed.agent_data.agent_id,
      agentName: parsed.agent_data.name,
      modelId: parsed.agent_data.model.id,
      modelName: parsed.agent_data.model.name,
      modelProvider: parsed.agent_data.model.provider,
      tokenMetrics: Private.convertTokenMetrics(parsed.metrics),
      chatSummary: parsed.chat_history.map(Private.convertChatHistory)
    };
  }

  /**
   * Fetch the runs for a particular session.
   *
   * @params options - The options that identifies the session of interest.
   *
   * @returns A full and complete history of the session runs. This can be
   *   used to restore the full state of a session from history.
   */
  async getSessionRuns(options: api.GetSessionRunsOptions): Promise<readonly api.SessionRun[]> {
    // Extract the options.
    const { sessionId } = options;

    // Make the fetch request.
    const resp = await fetch(`${this.baseURL}/sessions/${sessionId}/runs`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against request failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to JSON.
    const json = await resp.json();

    // Parse the agno response.
    const parsed = v.parse(sessionRunsSchema, json);

    // Return the translated result.
    return parsed.map(Private.convertSessionRun);
  }

  /**
   * Fetch the agentic memories subject to the options.
   *
   * @params options - The options for creating the request.
   *
   * @returns The agentic memories that have been stored for the user/agent.
   */
  async getMemories(_options: api.GetMemoriesOptions): Promise<api.GetMemoriesResult> {
    // Ignore the options and pagination for Agno for now.
    //
    // Not worth implementing if we are gonna ditch Agno.

    // Fetch the resource.
    const resp = await fetch(`${this.baseURL}/memories`, {
      headers: { 'Authorization': `Bearer ${this.authToken}` }
    });

    // Guard against fetch failure.
    if (!resp.ok) {
      throw new Error(`Response: ${resp.status} ${resp.statusText}`);
    }

    // Convert the response to JSON.
    const json = await resp.json();

    // Parse the agno response.
    const parsed = v.parse(memoriesSchema, json);

    // Return the translated result.
    return {
      limit: parsed.data.length,
      page: 0,
      pageCount: 1,
      totalCount: parsed.data.length,
      memories: parsed.data.map(Private.convertMemoryInfo)
    };
  }

  /**
   * Create a new session run according the options.
   *
   * @param options - The options for creating the run.
   *
   * @returns An async generator that streams run events.
   */
  async *createRun(options: api.CreateRunOptions): AsyncGenerator<agui.AGUIEvent> {

  }

  /**
   * Continue a session run after a human-in-the-loop pause.
   *
   * @param options - The options for continuing the run.
   *
   * @returns An async generator that continues the run events.
   */
  async *continueRunOptions(options: api.ContinueRunOptions): AsyncGenerator<agui.AGUIEvent> {

  }
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A function which converts Agno token metrics to CPP token metrics.
   */
  export
  function convertTokenMetrics(metrics: TokenMetrics): api.TokenMetrics {
    return {
      inputTokens: metrics.input_tokens,
      outputTokens: metrics.output_tokens,
      totalTokens: metrics.total_tokens
    };
  }

  /**
   * A function which converts Agno model metrics to CPP model metrics.
   */
  export
  function convertModelMetrics(metrics: ModelMetrics): api.ModelMetrics {
    return {
      modelId: metrics.model_id,
      modelProvider: metrics.model_provider,
      runCount: metrics.count
    };
  }

  /**
   * A function which converts Agno session info to CPP session info.
   */
  export
  function convertSessionInfo(info: SessionInfo): api.SessionInfo {
    return {
      sessionId: info.session_id,
      sessionName: info.session_name,
      createdAt: info.created_at,
      updatedAt: info.updated_at
    };
  }

  /**
   * A function which converts Agno chat history to CPP summary messages.
   */
  export
  function convertChatHistory(chm: ChatHistoryMessage): api.ChatSummaryMessage {
    return {
      role: chm.role,
      createdAt: (new Date(chm.created_at)).toISOString(),
      content: chm.content
    };
  }

  /**
   * A function which converts an Ango memory info to a CPP memory.
   */
  export
  function convertMemoryInfo(mi: MemoryInfo): api.AgenticMemory {
    return {
      agentId: mi.agent_id,
      content: mi.memory,
      memoryId: mi.memory_id,
      topics: mi.topics,
      updatedAt: mi.updated_at
    };
  }

  /**
   * A function that converts an Agno session run to a CPP session run.
   */
  export
  function convertSessionRun(sr: SessionRun): api.SessionRun {
    return {
      agentId: sr.agent_id,
      createdAt: sr.created_at,
      events: convertEvents(sr.events),
      runId: sr.run_id,
      updatedAt: sr.updated_at,
      userPrompt: sr.run_input
    };
  }

  /**
   *
   */
  function convertEvents(runEvents: RunEvent[]): agui.AGUIEvent[] {
    //
    const aguiEvents: agui.AGUIEvent[] = [];

    //
    for (const evt of runEvents) {
      switch (evt.event) {
      case 'RunStarted':
        aguiEvents.push(
          {
            type: agui.EventType.RUN_STARTED,
            threadId: evt.session_id,
            runId: evt.run_id,
          },
        );
        break;
      case 'RunContent':
        break;
      case 'RunPaused':
        break;
      case 'RunCompleted':
        aguiEvents.push({
          type: agui.EventType.RUN_FINISHED,
          threadId: evt.session_id,
          runId: evt.run_id,
          result: evt.content
        });
        break;
      case 'ToolCallStarted':
        break;
      case 'ToolCallCompleted':
        break;
      default:
        continue;
      }
    };

    // Return the converted events.
    return aguiEvents;
  }

  // /**
  //  *
  //  */
  // export
  // function convertRunEvent(re: RunEvent): agui.AGUIEvent | null {

  // }
}
