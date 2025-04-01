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
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage design",
    assignedPeople: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      {
        id: "2",
        name: "Michael Chen",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    ],
    colorMode: "info"
  },
  {
    id: "2",
    title: "API Integration",
    description: "Connect the frontend to the payment gateway API",
    assignedPeople: [
      {
        id: "3",
        name: "Emma Davis",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
      }
    ],
    colorMode: "success"
  },
  {
    id: "3",
    title: "Database Optimization",
    description: "Improve query performance and add indexes",
    assignedPeople: [
      {
        id: "4",
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg"
      },
      {
        id: "5",
        name: "Olivia Brown",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
      },
      {
        id: "6",
        name: "Robert Taylor",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
      }
    ],
    colorMode: "danger"
  },
  {
    id: "4",
    title: "Mobile Responsiveness",
    description: "Ensure all pages work well on mobile devices",
    assignedPeople: [
      {
        id: "7",
        name: "Eren Yeager",
        avatar: "https://randomuser.me/api/portraits/men/64.jpg"
      },
      {
        id: "8",
        name: "Mikasa Akerman",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg"
      },
    ],
    colorMode: "warning"
  }
];