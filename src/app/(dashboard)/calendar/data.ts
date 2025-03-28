// data.ts
export interface Event {
    title: string;
    start: Date;
    end: Date;
  }
  
  export const events: Event[] = [
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
    {
      title: 'Oil Change',
      start: new Date(2025, 2, 28, 14, 0),
      end: new Date(2025, 2, 28, 15, 0),
    },
    {
      title: 'Tire Rotation',
      start: new Date(2025, 3, 1, 9, 0),
      end: new Date(2025, 3, 1, 10, 30),
    },
    {
      title: 'Car Wash',
      start: new Date(2025, 2, 20, 15, 0),
      end: new Date(2025, 2, 20, 15, 45),
    },
    {
      title: 'Annual Inspection',
      start: new Date(2025, 3, 5, 11, 0),
      end: new Date(2025, 3, 5, 12, 0),
    },
    {
    title: 'Battery Check',
    start: new Date(2025, 2, 29, 9, 30),
    end: new Date(2025, 2, 29, 10, 0),
  },
  {
    title: 'Air Filter Replacement',
    start: new Date(2025, 3, 2, 13, 0),
    end: new Date(2025, 3, 2, 13, 45),
  },
  {
    title: 'Wheel Alignment',
    start: new Date(2025, 3, 7, 10, 0),
    end: new Date(2025, 3, 7, 11, 30),
  },
  {
    title: 'Coolant Flush',
    start: new Date(2025, 3, 10, 14, 0),
    end: new Date(2025, 3, 10, 15, 30),
  },
  {
    title: 'Detailing Service',
    start: new Date(2025, 3, 15, 9, 0),
    end: new Date(2025, 3, 15, 12, 0),
  },
  {
    title: 'Transmission Fluid Change',
    start: new Date(2025, 3, 20, 11, 0),
    end: new Date(2025, 3, 20, 13, 0),
  },
  {
    title: 'Headlight Polishing',
    start: new Date(2025, 3, 25, 15, 0),
    end: new Date(2025, 3, 25, 15, 45),
  },
  {
    title: 'Brake Fluid Check',
    start: new Date(2025, 3, 28, 10, 0),
    end: new Date(2025, 3, 28, 10, 30),
  },
  ];