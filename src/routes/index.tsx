/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createFileRoute
} from '@tanstack/react-router';

import type {
  ReactNode
} from 'react';

import {
  HomePage
} from '@/components/landing-page';

export
const Route = createFileRoute('/')({
  component: RouteComponent
});


function RouteComponent(): ReactNode {
  return (
    <HomePage/>
  );
}
