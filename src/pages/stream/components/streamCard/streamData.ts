export interface StreamData {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    author: {
      name: string;
      avatar?: string;
    };
    publishedDate: {
      day: string;
      month: string;
      year: number;
    };
    badge?: string;
    primaryAction: {
      label: string;
      onClick?: () => void;
    };
    secondaryAction?: {
      label: string;
      onClick?: () => void;
    };
  }
  
  export const sampleCards: StreamData[] = [
    {
      id: '1',
      title: 'Blog Heading examples include creating a health and wellness blog like',
      description: 'A comprehensive platform for creative collaboration and project management. Connect with teams, share ideas, and bring your vision to life. A comprehensive platform for creative collaboration and project management. Connect with teams, share ideas, and bring your',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1' 
      },
      publishedDate: {
        day: '21',
        month: 'Nov',
        year: 2025
      },
      badge: 'NEW',
      primaryAction: { label: 'MORE' },
      secondaryAction: { label: 'Share' }
    },
    {
      id: '2',
      title: 'Design System Best Practices',
      description: 'Build beautiful, consistent user interfaces with our comprehensive design tokens and component library. Perfect for modern web applications.',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop',
      author: {
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      publishedDate: {
        day: '21',
        month: 'Oct',
        year: 2025
      },
      badge: 'Popular',
      primaryAction: { label: 'MORE' },
      secondaryAction: { label: 'Share' }
    },
    {
      id: '3',
      title: 'Stream 3 Title',
      description: 'Build beautiful, consistent user interfaces with our comprehensive design tokens and component library. Perfect for modern web applications.',
      imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&h=600&fit=crop',
      author: {
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      publishedDate: {
        day: '21',
        month: 'Oct',
        year: 2025
      },
      badge: 'NEW',
      primaryAction: { label: 'MORE' },
      secondaryAction: { label: 'Share' }
    }
  ];