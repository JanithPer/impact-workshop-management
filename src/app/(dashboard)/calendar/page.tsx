// CalendarPage.tsx
'use client';

import PageHeader from '@/components/blocks/page-header';
import React, { useMemo, useState } from 'react'; // Modified: Added useMemo and useState
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { events } from './data'; // Removed this line
import { Event as CalendarEvent } from './data'; // Added: Import Event type, alias to CalendarEvent
import { useQuery } from "@tanstack/react-query"; // Added
import { api } from "@/lib/axios"; // Added
import { Task } from "@/types/task"; // Added
import { Skeleton } from "@/components/ui/skeleton"; // Added

// Setup the localizer
const localizer = momentLocalizer(moment);

// Define color modes
const colorModes = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  brown: 'bg-brown-500',
  black: 'bg-black-500',

  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
} as const;

// Added: Define fetchTasks function
const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks"); // Assuming API endpoint is /tasks
  return response.data.data; // Based on user's controller and users-table-client example
};

const CalendarPage = () => {
  // Added: State for current date and view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<any>('month'); // 'month', 'week', 'day', 'agenda' as per react-big-calendar types
  // Added: useQuery hook to fetch tasks
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // Added: Handlers for navigation and view changes
  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleView = (newView: any) => { // View can be 'month', 'week', 'day', 'agenda'
    setCurrentView(newView);
  };

  // Custom event style getter
  const eventPropGetter = (event: CalendarEvent) => { // Modified: Use CalendarEvent type
    const colorMap: { [key: string]: string } = {
      [colorModes.success]: '#22C55E', // Tailwind’s bg-green-500 color
      [colorModes.danger]: '#EF4444',  // Tailwind’s bg-red-500 color
      [colorModes.warning]: '#F59E0B', // Tailwind’s bg-yellow-500 color
      [colorModes.info]: '#3B82F6',    // Tailwind’s bg-blue-500 color
    };

    const backgroundColor = colorMap[colorModes[event.colorMode as keyof typeof colorModes]] || '#3174ad'; // Default color if no match

    return {
      style: {
        backgroundColor,
      },
    };
  };

  // Added: useMemo to transform tasks to calendar events
  const calendarEvents = useMemo(() => {
    if (!tasks) return [];
    return tasks.map((task: Task): CalendarEvent => ({
      title: task.name,
      start: new Date(task.start),
      end: task.end ? new Date(task.end) : new Date(new Date(task.start).getTime() + 30 * 60 * 1000), // Default 30 min duration if end is missing
      colorMode: task.colorMode,
      // resource: task, // Optional: pass the original task data for event handlers
    }));
  }, [tasks]);

  // Added: Loading state
  if (isLoading) {
    return (
      <div>
        <PageHeader firstLinkName="Projects" secondLinkName="Calendar" />
        <div className="px-4 flex justify-between">
          <h2 className="text-2xl">Calendar</h2>
        </div>
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-[800px] w-full mt-[50px]" />
        </div>
      </div>
    );
  }

  // Added: Error state
  if (error) {
    return (
      <div>
        <PageHeader firstLinkName="Projects" secondLinkName="Calendar" />
        <div className="px-4 flex justify-between">
          <h2 className="text-2xl">Calendar</h2>
        </div>
        <div className="container mx-auto px-4 text-red-500 mt-[50px]">
          Error loading tasks for the calendar. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader firstLinkName="Projects" secondLinkName="Calendar" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Calendar</h2>
      </div>
      <div className='h-[800px] pb-25'>
        <BigCalendar
          localizer={localizer}
          events={calendarEvents} // Modified: Use fetched and transformed events
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          style={{ margin: '50px' }}
          eventPropGetter={eventPropGetter}
          // Added: Controlled date and view props
          date={currentDate}
          view={currentView}
          onNavigate={handleNavigate}
          onView={handleView}
        />
      </div>
    </div>
  );
};

export default CalendarPage;