'use client'; // Add this at the top for client-side component

import PageHeader from '@/components/blocks/page-header';
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer
const localizer = momentLocalizer(moment);

// Define event type
interface Event {
  title: string;
  start: Date;
  end: Date;
}

const CalendarPage = () => {
  const events: Event[] = [
    {
      title: 'Registration Check',
      start: new Date(2025, 2, 26, 10, 0),
      end: new Date(2025, 2, 26, 11, 0),
    },
    {
      title: 'Replace Brakes',
      start: new Date(2025, 2, 26, 12, 0),
      end: new Date(2025, 2, 27, 6, 0),
    },
    {
      title: 'Replace Wiper Blades',
      start: new Date(2025, 2, 13, 11, 0),
      end: new Date(2025, 2, 13, 11, 3),
    },
  ];

  return (
    <>
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
        />
      </div>
    </>
  );
};

export default CalendarPage;