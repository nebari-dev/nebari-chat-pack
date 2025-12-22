/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import * as v from 'valibot';

const toolsSchema = v.object({
  tools: v.array(
    v.object({
      name: v.string(),
      description: v.optional(v.string()),

      parameters: v.object({
        type: v.optional(v.string()),
        properties: v.record(v.string(), v.unknown()),
        required: v.array(v.string()),
        additionalProperties: v.optional(v.boolean()),
      }),

      // present on some tool lists, absent on others
      requires_confirmation: v.optional(v.boolean()),
      external_execution: v.optional(v.boolean()),
    })
  ),
});

const modelSchema = v.object({
  name: v.string(),
  model: v.string(),
  provider: v.string(),
});

const agentSchema = v.object({
  id: v.string(),
  name: v.string(),
  db_id: v.string(),

  model: modelSchema,
  tools: v.optional(toolsSchema),

  sessions: v.object({
    session_table: v.string(),
    add_history_to_context: v.boolean(),
  }),

  memory: v.optional(v.object({
    enable_agentic_memory: v.boolean(),
    enable_user_memories: v.boolean(),
    memory_table: v.string(),
    model: modelSchema,
  })),

  system_message: v.object({
    markdown: v.boolean(),
  }),
});

const teamSchema = v.object({
  id: v.string(),
  name: v.string(),

  model: modelSchema,
  tools: toolsSchema,

  system_message: v.object({
    instructions: v.string(),
  }),

  streaming: v.optional(
    v.object({
      stream_member_events: v.boolean(),
    })
  ),

  members: v.optional(
    v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        db_id: v.string(),

        model: modelSchema,
        tools: toolsSchema,

        sessions: v.object({
          session_table: v.string(),
          add_history_to_context: v.boolean(),
        }),

        system_message: v.object({
          description: v.string(),
          markdown: v.boolean(),
        }),
      })
    )
  )
});

const workflowSchema = v.object({
  id: v.string(),
  name: v.string(),

  steps: v.array(
    v.object({
      name: v.string(),
      description: v.string(),
      type: v.string(),
      agent: v.object({
        name: v.string(),
        tools: v.optional(toolsSchema),
        system_message: v.object({
          instructions: v.string(),
        }),
      }),
    })
  ),
  workflow_agent: v.boolean(),
});

export const agentConfigSchema = v.union([agentSchema, teamSchema, workflowSchema]);

export
type AgentConfig = v.InferOutput<typeof agentConfigSchema>;

/**
 * A function which gets a configs for each agent setup.
 *
 * @returns A promise that resolves with the config.
 */
export
async function getAgentsConfig(type: string, id: string): Promise<any> {
  // Fetch the resource.
  const resp = await fetch(`/${type}s/${id}`);

  // Guard against request failure.
  if (!resp.ok) {
    throw new Error(`Response: ${resp.status} ${resp.statusText}`);
  }

  // Convert the response to json.
  const json = await resp.json();

  // Parse and return the response.
  return v.parse(agentConfigSchema, json);
}
