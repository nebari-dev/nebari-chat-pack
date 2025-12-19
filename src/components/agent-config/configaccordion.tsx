import type {
  ReactNode
} from "react";

import {
  Accordion, Box
} from "@chakra-ui/react";

/*
 * Renders the JSON data like YAML with more styling control
**/
function YamlView({ value }: { value: unknown }) {
  // renders primitives (strings | bools)
  if (value === null || typeof value !== "object") {
    return <span className="text-slate-600">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    return renderArray(value);
  }

  return renderObject(value);
}

/*
 * Renders the array objects names in particular "tools"{"tools": [{}, {}]}
**/
function renderArray(arr: unknown[]) {
  return (
    <div className="space-y-1">
      {arr.map((item, idx) => (
        <div key={idx} className="text-slate-600">
          {displayItem(item)}
        </div>
      ))}
    </div>
  );
}

/*
 * Renders the objects in the config data
**/
function renderObject(obj: object) {
  return (
    <div className="space-y-1">
      {Object.entries(obj).map(([key, val]) => {
        const isObject = typeof val === "object";

        return (
          <div key={key}>
            <div className="flex gap-4">
              <span className="font-semibold">{key}:</span>

              {!isObject && (
                <span className="text-slate-600 px-1 rounded">{String(val)}</span>
              )}
            </div>

            {isObject && (
              <div className="border-l-gray-400 border-l-2 pl-4">
                <YamlView value={val} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
/*
 * Support function to show the object name for the array of objects (Primarily used for tools)
**/
function displayItem(item: unknown): string {
  if (item && typeof item === "object" && "name" in item) {
    return String(item.name);
  }
  return String(item);
}

/*
 * ConfigAccordion component renders the accordion for the agent config page
**/
export function ConfigAccordion({ data }: ConfigAccordion.Props): ReactNode {
  if (!data) {
    return <Box>No config available</Box>;
  }

  return (
    <Accordion.Root multiple collapsible>
      {Object.entries(data).map(([key, value]) => (
        <Accordion.Item key={key} value={key}>
          <Accordion.ItemTrigger>
            <Accordion.ItemIndicator />
            <Box flex="1" textAlign="left">
              {key}
            </Box>
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <div className="bg-gray-200 rounded-md px-3 py-2 text-sm space-y-1">
                <YamlView value={value}/>
              </div>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

/*
 * Namespace for the ConfigAccordion
**/
export namespace ConfigAccordion {

  export type Props = {
    data: Record<string, string | Boolean | object | object[]>;
  }
}
