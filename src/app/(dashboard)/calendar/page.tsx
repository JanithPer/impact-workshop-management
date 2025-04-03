// CalendarPage.tsx
'use client';

import PageHeader from '@/components/blocks/page-header';
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { events } from './data';

// Setup the localizer
const localizer = momentLocalizer(moment);

// Define color modes
const colorModes = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
} as const;

const CalendarPage = () => {
  // Custom event style getter
  const eventPropGetter = (event: any) => {
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

  return (
    <div>
      <PageHeader firstLinkName="Projects" secondLinkName="Calendar" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Calendar</h2>
      </div>
      <div className='h-[800px] pb-25'>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          style={{ margin: '50px' }}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </div>
  );
};

export default CalendarPage;