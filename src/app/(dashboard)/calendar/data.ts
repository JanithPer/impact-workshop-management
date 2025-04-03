export interface Event {
  title: string;
  start: Date;
  end: Date;
  colorMode: 'success' | 'danger' | 'warning' | 'info';
}

export const events: Event[] = [
  // February Events
  {
    title: 'Replace Wiper Blades',
    start: new Date(2025, 1, 13, 11, 0), // Note: Month is 0-indexed, so 1 = February
    end: new Date(2025, 1, 13, 11, 30),
    colorMode: 'warning',
  },
  {
    title: 'Team Meeting',
    start: new Date(2025, 1, 15, 14, 0),
    end: new Date(2025, 1, 15, 15, 30),
    colorMode: 'info',
  },
  {
    title: 'Project Deadline',
    start: new Date(2025, 1, 28, 9, 0),
    end: new Date(2025, 1, 28, 17, 0),
    colorMode: 'danger',
  },

  // March Events (from your original data)
  {
    title: 'Registration Check',
    start: new Date(2025, 2, 26, 10, 0), // 2 = March
    end: new Date(2025, 2, 26, 11, 0),
    colorMode: 'info',
  },
  {
    title: 'Replace Brakes',
    start: new Date(2025, 2, 26, 12, 0),
    end: new Date(2025, 2, 27, 6, 0),
    colorMode: 'danger',
  },

  // April Events
  {
    title: 'Oil Change',
    start: new Date(2025, 3, 5, 9, 0), // 3 = April
    end: new Date(2025, 3, 5, 10, 0),
    colorMode: 'warning',
  },
  {
    title: 'Client Presentation',
    start: new Date(2025, 3, 15, 13, 0),
    end: new Date(2025, 3, 15, 15, 0),
    colorMode: 'info',
  },
  {
    title: 'System Maintenance',
    start: new Date(2025, 3, 20, 22, 0),
    end: new Date(2025, 3, 21, 2, 0),
    colorMode: 'danger',
  },
  {
    title: 'Project Completion',
    start: new Date(2025, 3, 30, 9, 0),
    end: new Date(2025, 3, 30, 17, 0),
    colorMode: 'success',
  },

  // May Events
  {
    title: 'Team Building Event',
    start: new Date(2025, 4, 10, 10, 0), // 4 = May
    end: new Date(2025, 4, 10, 16, 0),
    colorMode: 'success',
  },
  {
    title: 'Tire Rotation',
    start: new Date(2025, 4, 15, 14, 0),
    end: new Date(2025, 4, 15, 15, 0),
    colorMode: 'warning',
  },
  {
    title: 'Budget Review',
    start: new Date(2025, 4, 22, 11, 0),
    end: new Date(2025, 4, 22, 12, 30),
    colorMode: 'info',
  },
  {
    title: 'Server Upgrade',
    start: new Date(2025, 4, 28, 20, 0),
    end: new Date(2025, 4, 29, 4, 0),
    colorMode: 'danger',
  },
];