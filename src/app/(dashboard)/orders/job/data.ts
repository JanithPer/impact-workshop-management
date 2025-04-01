// data.ts
export interface Task {
    id: string;
    title: string;
    description: string;
    avatar: string;
    colorClass: string;
  }
  
  export const tasks: Task[] = [
    {
      id: "1",
      title: "Design Homepage",
      description: "Create wireframes and mockups for the new homepage design",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      colorClass: "bg-blue-500"
    },
    {
      id: "2",
      title: "API Integration",
      description: "Connect the frontend to the payment gateway API",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      colorClass: "bg-green-500"
    },
    {
      id: "3",
      title: "Database Optimization",
      description: "Improve query performance and add indexes",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      colorClass: "bg-purple-500"
    },
    {
      id: "4",
      title: "Mobile Responsiveness",
      description: "Ensure all pages work well on mobile devices",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      colorClass: "bg-yellow-500"
    }
  ];