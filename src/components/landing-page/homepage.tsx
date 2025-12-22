import type {
  ReactNode
} from 'react';

import {
  useConfig
} from '@/components/common';

import {
  Accordion
} from "@chakra-ui/react";

import {
  Explore
} from './explore'

import {
  ConfigList
} from './configlist'

/*
 * Renders the Home page component
 * This page just shows the genaral config for the backend
 * This includes general links mirrored from the sidebar
 * And a list of all available aggents, teams and workflows that are available
**/
export
function HomePage(): ReactNode {

  const config = useConfig();

  // Preset sections for the accordion component
  // Filer removes empty sections from the page
  const sections = [
    { label: "Agents", content: config.agents, type: "agent" },
    { label: "Teams", content: config.teams, type: "team" },
    { label: "Workflows", content: config.workflows, type: "workflow" },
  ].filter(section => section.content && section.content.length > 0);

  return (
    <main className='flex flex-col w-full gap-4'>
      <div className="text-xl font-bold p-6">Welcome</div>

      <div className="px-6">
          <div className="text-md font-semibold mb-4">Explore</div>
          <Explore/>
      </div>

      <Accordion.Root multiple collapsible defaultValue={["agent", "team", "workflow"]} className="px-6">
        {sections.map(({ label, content, type }) => (
          <Accordion.Item key={type} value={type}>
            <Accordion.ItemTrigger>
              <span className="text-md font-semibold">{label}</span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <ConfigList
                  content={content}
                  type={type}
                />
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </main>
  )
}
