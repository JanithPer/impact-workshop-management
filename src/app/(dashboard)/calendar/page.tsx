'use client'; // Add this at the top for client-side component

import PageHeader from '@/components/blocks/page-header';
import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { events } from './data';

// Setup the localizer
const localizer = momentLocalizer(moment);

const CalendarPage = () => {

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