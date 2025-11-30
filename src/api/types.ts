/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';


export
const runMetricsSchema = v.object({
  duration: v.number(),
  input_tokens: v.number(),
  output_tokens: v.number(),
  time_to_first_token: v.number(),
  total_tokens: v.number()
});


export
type RunMetrics = v.InferOutput<typeof runMetricsSchema>;


export
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


export
type RunStartedEvent = v.InferOutput<typeof runStartedEventSchema>;


export
const runContentEventSchema = v.object({
  event: v.literal('RunContent'),
  agent_id: v.string(),
  agent_name: v.string(),
  content: v.string(),
  content_type: v.string(),
  created_at: v.number(),
  reasoning_content: v.string(),
  run_id: v.string(),
  session_id: v.string(),
  workflow_agent: v.boolean()
});


export
type RunContentEvent = v.InferOutput<typeof runContentEventSchema>;


export
const runContentCompletedEventSchema = v.object({
  event: v.literal('RunContentCompleted'),
  agent_id: v.string(),
  agent_name: v.string(),
  created_at: v.number(),
  run_id: v.string(),
  session_id: v.string()
});


export
type RunContentCompletedEvent = v.InferOutput<typeof runContentCompletedEventSchema>;


export
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


export
type RunCompletedEvent = v.InferOutput<typeof runCompletedEventSchema>;


const toolCallSchema = v.object({
  created_at: v.number(),
  result: v.nullish(v.string()),
  tool_call_id: v.string(),
  tool_name: v.string(),
  tool_args: v.object({
    task: v.string()
  })
});


const toolCallEventBaseSchema = v.object({
  agent_id: v.string(),
  agent_name: v.string(),
  created_at: v.number(),
  run_id: v.string(),
  session_id: v.string(),
  tool: toolCallSchema
});


export
const toolCallStartedEventSchema = v.object({
  ...toolCallEventBaseSchema.entries,
  event: v.literal('ToolCallStarted')
});


export
type ToolCallStartedEvent = v.InferOutput<typeof toolCallStartedEventSchema>;


export
const toolCallCompletedEventSchema = v.object({
  ...toolCallEventBaseSchema.entries,
  event: v.literal('ToolCallCompleted'),
  content: v.string()
});


export
type ToolCallCompletedEvent = v.InferOutput<typeof toolCallCompletedEventSchema>;


export
const runEventSchema = v.union([
  runStartedEventSchema,
  runContentEventSchema,
  runContentCompletedEventSchema,
  runCompletedEventSchema,
  toolCallStartedEventSchema,
  toolCallCompletedEventSchema
]);


export
type RunEvent = v.InferOutput<typeof runEventSchema>;


export
const chatHistoryMessageSchema = v.object({
  content: v.optional(v.string()),  // TODO this schema is not well-typed
  created_at: v.number(),
  from_history: v.boolean(),
  stop_after_tool_call: v.boolean(),
  role: v.string()
});


export
type ChatHistoryMessage = v.InferOutput<typeof chatHistoryMessageSchema>;


export
const agentSessionDetailSchema = v.object({
  agent_session_id: v.string(),
  session_id: v.string(),
  session_name: v.string(),
  user_id: v.nullish(v.string()),
  agent_id: v.nullish(v.string()),
  chat_history: v.array(chatHistoryMessageSchema)
});


export
const sessionByIDSchema = v.union([agentSessionDetailSchema]);


export
type SessionByID = v.InferOutput<typeof sessionByIDSchema>;
