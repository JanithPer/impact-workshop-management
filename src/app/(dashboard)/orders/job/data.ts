export interface AssignedPerson {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedPeople: AssignedPerson[];
  colorMode?: 'success' | 'danger' | 'warning' | 'info';
}

export const tasks: Task[] = [
  {
    id: "1",
    title: "Engine Diagnostics",
    description: "Perform a full diagnostic scan to identify issues with fuel injection and turbo systems.",
    assignedPeople: [
      {
        id: "1",
        name: "John Carter",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg"
      },
      {
        id: "2",
        name: "Mike Thompson",
        avatar: "https://randomuser.me/api/portraits/men/34.jpg"
      },
      {
        id: "3",
        name: "Eren Yeager",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg"
      }
    ],
    colorMode: "info"
  },
  {
    id: "2",
    title: "Brake System Repair",
    description: "Replace worn-out brake pads and inspect the air brake system for leaks.",
    assignedPeople: [
      {
        id: "3",
        name: "Emma Davis",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg"
      }
    ],
    colorMode: "success"
  },
  {
    id: "3",
    title: "Transmission Overhaul",
    description: "Disassemble, inspect, and replace damaged gears in the transmission system.",
    assignedPeople: [
      {
        id: "4",
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      {
        id: "5",
        name: "Lucas Brown",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg"
      }
    ],
    colorMode: "danger"
  },
  {
    id: "4",
    title: "Suspension Repair",
    description: "Replace worn-out shocks and inspect leaf springs for any cracks or damages.",
    assignedPeople: [
      {
        id: "6",
        name: "David Martin",
        avatar: "https://randomuser.me/api/portraits/men/63.jpg"
      },
      {
        id: "7",
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      }
    ],
    colorMode: "warning"
  }
];
