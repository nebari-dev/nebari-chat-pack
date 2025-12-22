/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  ConfigAccordion
} from "@/components/agent-config/configaccordion"

import {
  useDetailConfig
} from './agentconfigprovider'

import {
  MessageSquare
} from 'lucide-react'

import {
  Card
} from '@/components/ui/card'

export function ConfigDetails({ type }: ConfigDetails.Props): ReactNode {
  // Fetch config
  const data = useDetailConfig();

  // Return rendered component
  return (
    <main className="w-full overflow-y-scroll">
      <div className='flex flex-row justify-between m-5'>
        <h2 className="text-xl font-bold">{data.name}</h2>
        <a href={`/chat?type=${type}&id=${data.id}`}>
          <Card className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-muted cursor-pointer">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Open in chat</span>
          </Card>
        </a>
      </div>
      

      <div className="w-1/3 mx-auto">
        <ConfigAccordion data={data} />
      </div>
    </main>
  );
}

// Namespace for the 
export namespace ConfigDetails {

  export type Props = {
    type: "agent" | "team" | "workflow"
  }
}
