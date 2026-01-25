/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable
} from '@tanstack/react-table';

import {
  type ReactNode
} from 'react';

import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

import {
  cn
} from '@/lib/utils';

import {
  usePoll
} from './usepoll';


/**
 * A react component that renders the events log
 */
export
function EventsLog(props: EventsLog.Props): ReactNode {
  // Extract the props.
  const { className } = props;

  // Return the rendered component.
  return (
    <Card className={ cn(
      'min-w-0 min-h-40 gap-2 py-4 rounded-sm', className) }>
      <CardHeader className='px-4'>
        <CardTitle>
          Events Log
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 grow min-h-0 flex flex-col'>
        <Private.DataTable />
      </CardContent>
    </Card>
  );
}


/**
 * The namespace for the `EventsLog` statics.
 */
export
namespace EventsLog {
  /**
   * A type alias for the `EventsLog` props.
   */
  export
  type Props = {
    /**
     * The class name for the component.
     */
    readonly className?: string;
  };
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A type alias for an event item.
   *
   * Assumed to be valid from the server.
   *
   * No client validation for the demo.
   */
  type EventItem = {
    readonly event_id: string;
    readonly ts: string;
    readonly type: string;
    readonly summary: string;
    readonly entity_refs: any;
  };

  /**
   * Create the helper for defining the columns.
   */
  const columnHelper = createColumnHelper<EventItem>();

  /**
   * Create the column to display the latency.
   */
  const summaryColumn = columnHelper.accessor('summary', {
    header: 'Summary',
    cell: cellContext => {
      const type = cellContext.row.original.type;
      const className = (
        type === 'track_update' ?
        'text-red-700' :
        type === 'sensor_health' ?
        'text-green-700' :
        ''
      );
      return (
        <span className={ className }>
          { cellContext.getValue() }
        </span>
      );
    },
  });

  /**
   * Create the column to display the last timestamp
   */
  const timeColumn = columnHelper.accessor('ts', {
    header: 'Time',
    cell: cellContext => {
      const date = new Date(cellContext.getValue());
      return date.toLocaleTimeString();
    },
  });

  /**
   * The column definitions for the table.
   */
  const columns = [
    summaryColumn,
    timeColumn
  ];

  /**
   * A React component that sensor status table.
   */
  export
  function DataTable(): ReactNode {
    // Set up the data polling loop.
    const data = usePoll<EventItem[]>(2000, '/api/api/events') ?? [];

    // Create the data table model.
    const table = useReactTable({
      data: data,
      columns: columns,
      getCoreRowModel: getCoreRowModel()
    });

    // Create the array to hold the header rows.
    const headerRows: ReactNode[] = [];

    // Create the column -> className mapping.
    const classNames = {
      summary: '',
      ts: 'w-35'
    } as Record<string, string>;

    // Iterate the header groups to create the header rows.
    for (const group of table.getHeaderGroups()) {
      // Create the array to hold the cells for the group.
      const cells: ReactNode[] = [];

      // Iterate the header to create the cells.
      for (const header of group.headers) {
        // Format the content for the header cell.
        const template = header.column.columnDef.header;
        const content = flexRender(template, header.getContext());

        // Create and add the header cell.
        cells.push(
          <TableHead
            key={ header.id }
            className={ classNames[header.id] }>
            { content }
          </TableHead>
        );
      }

      // Create and add the header row.
      headerRows.push(<TableRow key={ group.id }>{ cells }</TableRow>);
    }

    // Create the array to hold the body rows.
    const bodyRows: ReactNode[] = [];

    // Iterate the model to create the body rows.
    for (const row of table.getRowModel().rows) {
      // Create the array to hold the cells for the row.
      const cells: ReactNode[] = [];

      // Iterate the row to create the cells.
      for (const cell of row.getAllCells()) {
        // Format the content for the body cell.
        const template = cell.column.columnDef.cell;
        const content = flexRender(template, cell.getContext());

        // Create and add the body cell.
        cells.push(<TableCell key={ cell.id }>{ content }</TableCell>);
      }

      // Create and add the body row.
      bodyRows.push(<TableRow key={ row.id }>{ cells }</TableRow>);
    }

    // Insert a placeholder row when there are no memories.
    if (bodyRows.length === 0) {
      bodyRows.push(
        <TableRow key='$no_data_available'>
          <TableCell
            colSpan={ table.getAllColumns().length }
            className='text-center text-muted-foreground'>
            No data available
          </TableCell>
        </TableRow>
      );
    }

    // Return the rendered component.
    return (
      <div className='rounded-sm border border-border grow overflow-y-auto'>
        <Table className='table-fixed'>
          <TableHeader>
            { headerRows }
          </TableHeader>
          <TableBody>
            { bodyRows }
          </TableBody>
        </Table>
      </div>
    );
  }
}
