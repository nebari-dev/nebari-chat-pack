/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import { clsx } from 'clsx';

import { type ReactNode, useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { DownloadIcon, InfoIcon, DatabaseIcon } from 'lucide-react';
import { useChatRuntime } from '../../chat/chatruntimeprovider';

export function ScheduleRenderer({
  result,
}: ScheduleRenderer.Props): ReactNode {
  const runtime = useChatRuntime();

  // Defensive coding: Ensure data exists
  if (!result || !result.data) {
    return (
      <div className='text-destructive border-destructive rounded-md border p-4'>
        Error: No schedule data received.
      </div>
    );
  }

  const { status, assignments = [], metadata } = result.data;

  // Safe access for metadata
  const periods = metadata?.periods || [];
  const rooms = metadata?.rooms || [];

  if (periods.length === 0 || rooms.length === 0) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Schedule Generation Incomplete</CardTitle>
          <CardDescription>
            {status === 'Infeasible'
              ? 'The optimization engine could not find a valid schedule with the current constraints.'
              : 'No schedule data available to render.'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Transform assignments into a lookup map: [room_id][period] -> Assignment
  const scheduleMap = useMemo(() => {
    const map: Record<string, Record<string, any>> = {};
    assignments.forEach((asn: any) => {
      if (!map[asn.room_id]) {
        map[asn.room_id] = {};
      }
      map[asn.room_id][asn.period] = asn;
    });
    return map;
  }, [assignments]);

  const handleExport = () => {
    // Generate CSV content
    const headers = [
      'Room',
      'Period',
      'Course',
      'Teacher',
      'Students Count',
      'Student Names',
    ];
    const rows = assignments.map((asn: any) => [
      asn.room_name,
      asn.period,
      asn.section_name,
      asn.teacher_name,
      asn.student_count || asn.students, // Fallback if backend not updated
      Array.isArray(asn.students) ? asn.students.join(';') : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((c) => `"${c}"`).join(',')), // Quote fields
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'master_schedule_draft.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className='w-full overflow-hidden'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span>Master Schedule Draft</span>
            <Badge variant={status === 'Success' ? 'default' : 'destructive'}>
              {status}
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <Button size='sm' variant='outline' onClick={handleExport}>
              <DownloadIcon className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
            <Button
              size='sm'
              onClick={() =>
                runtime.onUserSubmit('Save this schedule to RosarioSIS')
              }
            >
              <DatabaseIcon className='mr-2 h-4 w-4' />
              Save to RosarioSIS
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {assignments.length} sections scheduled across {rooms.length} rooms.
        </CardDescription>
      </CardHeader>
      <CardContent className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Room</TableHead>
              {periods.map((p: string) => (
                <TableHead key={p} className='min-w-[140px]'>
                  {p}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room: any) => (
              <TableRow key={room.id}>
                <TableCell className='bg-muted/50 font-medium'>
                  {room.name}
                  <div className='text-muted-foreground text-xs'>
                    Cap: {room.capacity}
                  </div>
                </TableCell>
                {periods.map((p: string) => {
                  const asn = scheduleMap[room.id]?.[p];
                  return (
                    <TableCell key={`${room.id}-${p}`} className='border-l p-2'>
                      {asn ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <div
                              className={clsx(
                                'bg-primary/10 border-primary/20 rounded-md border p-2 text-xs',
                                'hover:bg-primary/20 cursor-pointer transition-colors',
                              )}
                            >
                              <div
                                className='truncate font-bold'
                                title={asn.section_name}
                              >
                                {asn.section_name}
                              </div>
                              <div
                                className='text-muted-foreground truncate'
                                title={asn.teacher_name}
                              >
                                {asn.teacher_name}
                              </div>
                              <div className='mt-1 flex items-center justify-between text-[10px]'>
                                <span>
                                  {asn.student_count ?? asn.students} students
                                </span>
                                <InfoIcon className='h-3 w-3 opacity-50' />
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className='flex max-h-[80vh] flex-col'>
                            <DialogHeader>
                              <DialogTitle>{asn.section_name}</DialogTitle>
                              <DialogDescription>
                                {asn.teacher_name} • {asn.room_name} •{' '}
                                {asn.period}
                              </DialogDescription>
                            </DialogHeader>

                            <div className='bg-muted/20 mt-2 min-h-0 flex-1 overflow-y-auto rounded-md border p-2'>
                              <h4 className='mb-2 text-sm font-semibold'>
                                Enrolled Students (
                                {asn.student_count ??
                                  (Array.isArray(asn.students)
                                    ? asn.students.length
                                    : asn.students)}
                                )
                              </h4>
                              <ul className='space-y-1 text-sm'>
                                {Array.isArray(asn.students) &&
                                asn.students.length > 0 ? (
                                  asn.students.map(
                                    (student: string, i: number) => (
                                      <li
                                        key={i}
                                        className='flex items-center gap-2'
                                      >
                                        <span className='bg-primary/50 h-1.5 w-1.5 rounded-full' />
                                        {student}
                                      </li>
                                    ),
                                  )
                                ) : (
                                  <li className='text-muted-foreground italic'>
                                    No student list available.
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div className='bg-secondary/20 mt-4 rounded-md border p-3 text-sm'>
                              <h4 className='mb-1 font-semibold'>
                                Want to move this class?
                              </h4>
                              <p className='text-muted-foreground text-xs'>
                                Ask the agent:
                                <span className='bg-muted ml-1 rounded px-1 font-mono select-all'>
                                  Move {asn.section_name} to{' '}
                                  {asn.period === 'P1'
                                    ? 'P2'
                                    : 'another period'}{' '}
                                  in {asn.room_name}
                                </span>
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className='text-muted-foreground/20 flex h-full min-h-[60px] items-center justify-center text-xs'>
                          -
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export namespace ScheduleRenderer {
  export interface Props {
    result: MimeResult;
  }

  export interface MimeResult {
    mimeType: 'application/vnd.openteams-schedule';
    data: {
      status: string;
      assignments: any[];
      metadata: {
        teachers: any[];
        rooms: any[];
        periods: string[];
      };
    };
  }
}
