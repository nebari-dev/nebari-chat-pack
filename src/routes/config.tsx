import { createFileRoute } from '@tanstack/react-router';
import type {
  QueryClient
} from '@tanstack/react-query';

import {
  ConfigDetails,
  ConfigContext
} from '@/components/agent-config'

import * as v from 'valibot';
import * as api from '@/api';

const baseSchema = v.object({
  type: v.union([
    v.literal("agents"),
    v.literal("teams"),
    v.literal("workflows"),
  ]),
  id: v.string(),
});

const configQuery = (type: string, id: string) =>
  ({
    queryKey: ["config", type, id],
    queryFn: () => api.getAgentsConfig(type, id),
    staleTime: 'static',
  } as const);

/**
 * The loader function for the config query.
 */
function loadConfig(client: QueryClient, type: string, id: string) {
  return client.ensureQueryData(configQuery(type, id));
}

export
const Route = createFileRoute('/config')({
  validateSearch: baseSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => loadConfig(context.queryClient, deps.type, deps.id),
  component: RouteComponent,
});

function RouteComponent() {
  const config = Route.useLoaderData();

  return (
    <ConfigContext value={ config }>
      <ConfigDetails/>
    </ConfigContext>
  );
}
