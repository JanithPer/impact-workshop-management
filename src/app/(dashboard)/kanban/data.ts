export interface AssignedPerson {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedPeople: AssignedPerson[];
  colorMode?: 'success' | 'danger' | 'warning' | 'info';
}

export const tasks: Task[] = [
  { 
    id: '1', 
    title: 'Engine Diagnostics', 
    description: 'Perform a full scan to check turbo and fuel injection systems.', 
    status: 'todo',
    assignedPeople: [
      {
        id: '1',
        name: 'John Carter',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      }
    ],
    colorMode: 'danger'
  },
  { 
    id: '2', 
    title: 'Brake System Repair', 
    description: 'Replace worn-out brake pads and check air brake system.', 
    status: 'in-progress',
    assignedPeople: [
      {
        id: '2',
        name: 'Mike Thompson',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg'
      },
      {
        id: '3',
        name: 'Emma Davis',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      }
    ],
    colorMode: 'info'
  },
  { 
    id: '3', 
    title: 'Transmission Overhaul', 
    description: 'Disassemble and replace damaged gears in the transmission system.', 
    status: 'in-progress',
    assignedPeople: [
      {
        id: '4',
        name: 'James Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
      }
    ],
    colorMode: 'success'
  },
  { 
    id: '4', 
    title: 'Suspension Repair', 
    description: 'Replace shocks and inspect leaf springs for cracks.', 
    status: 'done',
    assignedPeople: [
      {
        id: '5',
        name: 'David Martin',
        avatar: 'https://randomuser.me/api/portraits/men/63.jpg'
      },
      {
        id: '6',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      }
    ],
    colorMode: 'warning'
  },
  { 
    id: '5', 
    title: 'Oil & Filter Change', 
    description: 'Change engine oil and replace fuel/air filters.', 
    status: 'todo',
    assignedPeople: [
      {
        id: '7',
        name: 'Ethan Brooks',
        avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
      }
    ],
    colorMode: 'success'
  },
  { 
    id: '6', 
    title: 'Exhaust System Inspection', 
    description: 'Check for leaks, rust, and clean diesel particulate filter.', 
    status: 'in-progress',
    assignedPeople: [
      {
        id: '8',
        name: 'Robert Taylor',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      }
    ],
    colorMode: 'info'
  },
  { 
    id: '7', 
    title: 'Electrical System Repair', 
    description: 'Diagnose and fix battery, alternator, and wiring issues.', 
    status: 'done',
    assignedPeople: [
      {
        id: '9',
        name: 'Liam Anderson',
        avatar: 'https://randomuser.me/api/portraits/men/50.jpg'
      },
      {
        id: '10',
        name: 'Olivia Brown',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
      }
    ],
    colorMode: 'danger'
  }
];
