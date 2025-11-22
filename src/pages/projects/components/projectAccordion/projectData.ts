export interface ProjectData {
  id: string;
  title: string;
  status: 'dev' | 'stg' | 'prod';
  techStack: string[];
  description: string[];
  links: {
    github?: string;
    app?: string;
  };
}

export const sampleProjects: ProjectData[] = [
  {
    id: '1',
    title: 'DevSpace Platform',
    status: 'prod',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    description: [
      'Comprehensive platform for creative collaboration and project management',
      'Real-time collaboration and task management features',
      'Seamless integration with popular development tools',
      'Cloud-based infrastructure with AWS deployment'
    ],
    links: {
      github: 'https://github.com/devspace/platform',
      app: 'https://devspace.example.com'
    }
  },
  {
    id: '2',
    title: 'E-Commerce Portal',
    status: 'stg',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Docker'],
    description: [
      'Modern e-commerce solution with advanced inventory management',
      'Secure payment processing and customer analytics',
      'Microservices architecture for scalability and reliability',
      'Containerized deployment with Docker'
    ],
    links: {
      github: 'https://github.com/company/ecommerce',
      app: 'https://staging.ecommerce.example.com'
    }
  },
  {
    id: '3',
    title: 'Analytics Dashboard',
    status: 'prod',
    techStack: ['Python', 'Django', 'React', 'PostgreSQL', 'Celery'],
    description: [
      'Real-time analytics with interactive visualizations',
      'Processes millions of data points daily',
      'Advanced filtering and export capabilities',
      'Asynchronous task processing with Celery'
    ],
    links: {
      github: 'https://github.com/analytics/dashboard',
      app: 'https://analytics.example.com'
    }
  },
  {
    id: '4',
    title: 'Mobile Banking App',
    status: 'dev',
    techStack: ['React Native', 'TypeScript', 'GraphQL', 'MongoDB'],
    description: [
      'Secure mobile banking with biometric authentication',
      'Instant transfers and comprehensive financial tracking',
      'Cross-platform support for iOS and Android',
      'Currently in active development with beta testing'
    ],
    links: {
      github: 'https://github.com/bank/mobile-app'
    }
  },
  {
    id: '5',
    title: 'Content Management System',
    status: 'stg',
    techStack: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'S3'],
    description: [
      'Flexible CMS with drag-and-drop interface',
      'Multi-language support and content versioning',
      'S3 integration for media storage',
      'Designed for enterprise-scale content operations'
    ],
    links: {
      app: 'https://staging.cms.example.com'
    }
  },
  {
    id: '6',
    title: 'IoT Monitoring System',
    status: 'prod',
    techStack: ['Go', 'InfluxDB', 'Grafana', 'MQTT', 'Kubernetes'],
    description: [
      'Enterprise IoT platform for device monitoring at scale',
      'Real-time alerts and predictive maintenance',
      'Comprehensive device lifecycle management',
      'Kubernetes orchestration for high availability'
    ],
    links: {
      github: 'https://github.com/iot/monitor',
      app: 'https://iot.example.com'
    }
  }
];

