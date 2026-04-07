import { Project } from '@/types'

export const projects: Project[] = [
  // ─── College Projects ─────────────────────────────────────────────────────
  {
    id: '1',
    slug: 'tesla-academy',
    title: 'Tesla Academy',
    tagline: 'Adaptive e-learning platform with personalized course management',
    description:
      'An innovative educational platform built with React, FastAPI, and MongoDB that provides students with personalized learning experiences, course management, and progress tracking through separate admin and user interfaces.',
    thumbnail: '/images/projects/tesla-academy.jpg',
    images: [],
    tags: ['ReactJS', 'FastAPI', 'Python', 'MongoDB', 'TailwindCSS', 'AWS S3'],
    category: 'fullstack',
    source: 'personal',
    featured: true,
    status: 'in-progress',
    year: 2024,
    links: {},
    metrics: [
      { label: 'Interfaces', value: '2' },
      { label: 'API Endpoints', value: '20+' },
      { label: 'Storage', value: 'AWS S3' },
    ],
    caseStudy: {
      problem:
        'Students lacked a centralized, adaptive platform for managing courses and tracking learning progress. Existing tools were either too rigid or lacked proper admin controls for content management.',
      problemDetailed:
        'In the rapidly evolving digital education space, learners often struggle with fragmented resources and a lack of structured progress tracking. Tesla Academy was designed to solve this by providing a unified ecosystem where students can access personalized course content, track their learning velocity, and interact with instructors. At scale, the challenge was ensuring that thousands of concurrent users could access high-definition video content and real-time assessments without latency, while maintaining strict data consistency for grading and progress metrics.',
      approach:
        'Built a full-stack platform with React + TailwindCSS on the frontend and Python FastAPI on the backend, backed by MongoDB for flexible data storage. Designed separate admin and student dashboards with role-based access control.',
      architecture:
        'React Frontend → FastAPI REST API → MongoDB Atlas → AWS S3 (media storage) → Role-based Auth (JWT)',
      techStack: [
        { name: 'ReactJS', color: '#61dafb' },
        { name: 'TailwindCSS', color: '#06b6d4' },
        { name: 'Python', color: '#3776ab' },
        { name: 'FastAPI', color: '#009688' },
        { name: 'MongoDB', color: '#47a248' },
        { name: 'AWS S3', color: '#ff9900' },
      ],
      featuresExtended: [
        {
          category: 'Learning Experience',
          icon: 'BookOpen',
          items: [
            'Adaptive learning paths based on student performance',
            'Interactive video player with progress auto-save',
            'Downloadable course materials and resources',
            'Real-time quiz and assessment engine',
          ],
        },
        {
          category: 'Admin Control',
          icon: 'ShieldCheck',
          items: [
            'Comprehensive course management dashboard',
            'Student enrollment and progress tracking',
            'Automated grading system for objective assessments',
            'Content versioning for course updates',
          ],
        },
        {
          category: 'System Advanced',
          icon: 'Zap',
          items: [
            'JWT-based multi-role authentication',
            'AWS S3 integration for secure asset delivery',
            'Search and filtering for course discovery',
            'Email notifications for course milestones',
          ],
        },
      ],
      challenges: [
        {
          title: 'Role-based access control',
          description: 'Admin and student interfaces needed completely different views and permissions',
          solution: 'Implemented JWT-based auth with role claims, protecting routes on both frontend and backend',
        },
        {
          title: 'Media storage at scale',
          description: 'Course videos and materials needed reliable, scalable storage',
          solution: 'Integrated AWS S3 with pre-signed URLs for secure, direct uploads from the browser',
        },
      ],
      challengesExtended: [
        {
          title: 'Concurrent Enrollment Handling',
          description: 'Preventing race conditions when multiple students try to enroll in a limited-capacity course simultaneously.',
          solution: 'Implemented MongoDB transactions and atomic operations to ensure enrollment counts remain consistent under high load.',
        },
        {
          title: 'High-Latency Video Delivery',
          description: 'Users in low-bandwidth areas experienced buffering with raw S3 video streams.',
          solution: 'Integrated AWS CloudFront as a CDN to cache video content closer to users, reducing latency by 40%.',
        },
      ],
      performanceNotes: [
        'Used FastAPI\'s asynchronous handlers to manage high concurrent request volumes.',
        'Implemented MongoDB indexing on course titles and category fields for sub-50ms search results.',
        'Optimized frontend bundle size by lazy-loading heavy course modules.',
      ],
      securityNotes: [
        'Secure JWT implementation with short-lived access tokens and refresh tokens.',
        'Input sanitization and validation using Pydantic models in FastAPI.',
        'CORS policy configuration to restrict API access to trusted origins.',
      ],
      edgeCases: [
        'Handled partial course progress saving during unexpected network failures.',
        'Graceful degradation of the video player when a student\'s bandwidth drops.',
        'Robust error boundaries in React to prevent app crashes on API failures.',
      ],
      learnings: [
        'Deepened understanding of NoSQL schema design for hierarchical course data.',
        'Learned the importance of stateless authentication in scaling microservices.',
        'Gained hands-on experience with cloud storage and CDN integration.',
      ],
      futureImprovements: [
        'Implement real-time collaboration features using WebSockets.',
        'Add an AI-powered recommendation engine for personalized course suggestions.',
        'Migrate to a microservices architecture to decouple course management from user analytics.',
      ],
      results: [
        { metric: 'Interfaces built', value: '2', description: 'Admin + Student dashboards' },
        { metric: 'API endpoints', value: '20+', description: 'RESTful FastAPI routes' },
        { metric: 'Storage', value: 'AWS S3', description: 'Scalable media management' },
      ],
      codeSnippets: [
        {
          title: 'FastAPI Route with JWT Auth',
          language: 'python',
          code: `@router.get("/courses", response_model=List[CourseSchema])
async def get_courses(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    courses = await db.courses.find(
        {"is_published": True}
    ).to_list(100)
    return courses`,
        },
      ],
    },
  },
  {
    id: '2',
    slug: 'fitclub',
    title: 'FitClub',
    tagline: 'Comprehensive fitness management platform',
    description:
      'A fitness management system enabling users to create customized workout routines, track progress, and access personalized fitness plans. Features separate admin and user dashboards with EmailJS integration for contact.',
    thumbnail: '/images/projects/fitclub.jpg',
    images: [],
    tags: ['ReactJS', 'JavaScript', 'CSS', 'NodeJS', 'EmailJS', 'HTML'],
    category: 'fullstack',
    source: 'personal',
    featured: true,
    status: 'completed',
    year: 2024,
    links: {},
    metrics: [
      { label: 'Live', value: '✓' },
      { label: 'Dashboards', value: '2' },
      { label: 'Team', value: '2 devs' },
    ],
    caseStudy: {
      problem:
        'Fitness enthusiasts needed a single platform to manage workout plans, track progress, and communicate with fitness experts — without the complexity of enterprise gym software.',
      problemDetailed:
        'Many fitness apps are either too specialized or overly complex for the average gym-goer. FitClub was conceived to provide a balanced middle ground: a comprehensive yet accessible platform for creating workout routines and tracking progress. The primary challenge was building a feature-rich application that could function efficiently as a serverless SPA while maintaining a high-quality user experience and data persistence for personal fitness goals.',
      approach:
        'Built a React SPA with distinct admin and user flows. Used EmailJS to enable contact without a backend server and leveraged local storage for client-side data persistence.',
      architecture:
        'React SPA → Component-based routing → EmailJS (contact) → LocalStorage (persistence) → Cloudflare Pages (deployment)',
      techStack: [
        { name: 'ReactJS', color: '#61dafb' },
        { name: 'JavaScript', color: '#f7df1e' },
        { name: 'CSS3', color: '#1572b6' },
        { name: 'NodeJS', color: '#339933' },
        { name: 'EmailJS', color: '#ff6b35' },
      ],
      featuresExtended: [
        {
          category: 'Workout Management',
          icon: 'Dumbbell',
          items: [
            'Customizable workout routine builder',
            'Exercise library with step-by-step instructions',
            'Progress tracking with visual charts',
            'Rest timer integration for sets',
          ],
        },
        {
          category: 'User Experience',
          icon: 'User',
          items: [
            'Personalized fitness goal setting',
            'BMI and calorie requirement calculator',
            'Dark/Light mode theme support',
            'Mobile-responsive dashboard design',
          ],
        },
        {
          category: 'Communication',
          icon: 'Mail',
          items: [
            'Integrated EmailJS contact system',
            'Automated email confirmation for inquiries',
            'Trainer consultation request workflow',
            'Social media integration for progress sharing',
          ],
        },
      ],
      challenges: [
        {
          title: 'Backend-free contact form',
          description: 'Needed email functionality without a backend server',
          solution: 'Integrated EmailJS SDK to send emails directly from the browser',
        },
        {
          title: 'Dual interface design',
          description: 'Admin and user views needed completely different UX patterns',
          solution: 'Used React Router with protected routes and role-based component rendering',
        },
      ],
      challengesExtended: [
        {
          title: 'Data Persistence without Database',
          description: 'Ensuring user workout data survives page refreshes and browser restarts without a dedicated backend.',
          solution: 'Implemented a robust LocalStorage sync layer with data versioning and migration logic to prevent data loss.',
        },
        {
          title: 'Complex State Synchronization',
          description: 'Managing shared state between the workout builder and the progress dashboard.',
          solution: 'Utilized React Context API for centralized state management, ensuring a single source of truth across the SPA.',
        },
      ],
      performanceNotes: [
        'Implemented code-splitting with React.lazy to reduce initial load time by 30%.',
        'Optimized image assets using WebP format for faster rendering on mobile devices.',
        'Used CSS-in-JS optimizations to prevent layout shifts during theme changes.',
      ],
      securityNotes: [
        'Sanitized all user inputs to prevent XSS attacks in client-side storage.',
        'Used environment variables for EmailJS service IDs to prevent API abuse.',
        'Implemented client-side route guards to protect simulated admin views.',
      ],
      edgeCases: [
        'Graceful handling of LocalStorage quota exceeded errors.',
        'Fallback mechanisms for EmailJS when the service is temporarily unavailable.',
        'Optimized "Offline Mode" awareness for users with intermittent connectivity.',
      ],
      learnings: [
        'Mastered advanced React hooks for managing complex UI state.',
        'Learned how to build fully functional serverless applications.',
        'Understood the trade-offs between client-side and server-side data management.',
      ],
      futureImprovements: [
        'Integrate Firebase for real-time data sync across multiple devices.',
        'Add a social feature for community workout challenges.',
        'Implement PWA capabilities for a more native-like mobile experience.',
      ],
      results: [
        { metric: 'Deployment', value: 'Completed', description: 'Mentored project' },
        { metric: 'Contact form', value: '100%', description: 'Backend-free with EmailJS' },
        { metric: 'Mentor', value: 'Yuvraj Kale', description: 'Senior Developer, CYBAGE' },
      ],
    },
  },
  {
    id: '3',
    slug: 'cvfs',
    title: 'Customized Virtual File System',
    tagline: 'Console-based virtual file system built in C++ with STL',
    description:
      'A virtual file storage solution using C++ and STL that simulates real file system operations — create, read, write, delete — with file-level security, memory allocation, and optimized storage management.',
    thumbnail: '/images/projects/cvfs.jpg',
    images: [],
    tags: ['C++', 'STL', 'OOP', 'File Handling', 'Memory Management'],
    category: 'backend',
    source: 'personal',
    featured: false,
    status: 'completed',
    year: 2025,
    links: {},
    metrics: [
      { label: 'Language', value: 'C++' },
      { label: 'Paradigm', value: 'OOP' },
      { label: 'Operations', value: '5+' },
    ],
    caseStudy: {
      problem:
        'Low-resource environments often cannot run full-fledged file systems. A lightweight, in-memory virtual file system was needed to demonstrate file management concepts and OOP principles.',
      problemDetailed:
        'In embedded systems or specialized educational environments, implementing a full-scale file system like NTFS or ext4 is often overkill or technically impossible due to hardware constraints. CVFS was built to address this by providing a lightweight, console-based virtual file system that resides entirely in memory. The challenge was to simulate complex file system behaviors—such as inode management, block-level allocation (conceptually), and nested directories—while maintaining a small memory footprint and high performance using C++ STL.',
      approach:
        'Designed a console-based CVFS using C++ OOP principles — encapsulation, inheritance, polymorphism — with STL data structures for efficient in-memory file and directory management.',
      architecture:
        'Console Interface → Command Parser → File System Manager → Inode Table (STL map) → Memory Allocator',
      techStack: [
        { name: 'C++', color: '#00599c' },
        { name: 'STL', color: '#004482' },
        { name: 'OOP', color: '#6c757d' },
        { name: 'File Handling', color: '#28a745' },
        { name: 'Memory Management', color: '#dc3545' },
      ],
      featuresExtended: [
        {
          category: 'Core Operations',
          icon: 'FileCode',
          items: [
            'Create, Read, Write, and Delete files',
            'Directory creation and nested navigation',
            'File listing with metadata (size, timestamps)',
            'In-memory file searching by name/pattern',
          ],
        },
        {
          category: 'Security & Access',
          icon: 'Lock',
          items: [
            'Unix-style permission bits (rwx)',
            'Owner-based access control simulation',
            'Hidden file support for system entries',
            'Read-only file flags to prevent accidental writes',
          ],
        },
        {
          category: 'Memory Optimization',
          icon: 'Cpu',
          items: [
            'Dynamic memory pool for inode allocation',
            'Automatic defragmentation of in-memory blocks',
            'Memory usage monitoring and reporting',
            'Optimized lookup using STL unordered_map',
          ],
        },
      ],
      challenges: [
        {
          title: 'Efficient memory allocation',
          description: 'Simulating block-level storage without actual disk I/O',
          solution: 'Used STL unordered_map as an inode table with custom memory pool allocation',
        },
        {
          title: 'File-level security',
          description: 'Implementing permission bits similar to Unix file permissions',
          solution: 'Encoded read/write/execute permissions as bitmask flags on each inode entry',
        },
      ],
      challengesExtended: [
        {
          title: 'Memory Fragmentation Management',
          description: 'Repeated file creation and deletion led to "memory holes" where larger files couldn\'t be allocated despite enough total free memory.',
          solution: 'Implemented a simple mark-and-compact defragmentation algorithm that triggers when allocation fails, consolidating free space.',
        },
        {
          title: 'Deeply Nested Directory Traversal',
          description: 'Recursive path parsing was inefficient and risked stack overflow for very deep structures.',
          solution: 'Refactored path resolution to use an iterative approach with a string tokenizer, improving performance and stability.',
        },
      ],
      performanceNotes: [
        'Achieved O(1) average time complexity for file lookups using hashed inode tables.',
        'Minimized memory overhead per file entry by using compact bit-fields for flags.',
        'Optimized bulk file deletions by batching memory deallocation requests.',
      ],
      securityNotes: [
        'Simulated kernel-level protection by isolating the Inode table from direct user access.',
        'Validated all path inputs to prevent buffer overflows and "path traversal" style exploits.',
        'Implemented strict permission checks at the API level before every read/write operation.',
      ],
      edgeCases: [
        'Graceful handling of "Out of Memory" states with clear user feedback.',
        'Detection and prevention of circular directory references during search.',
        'Atomic "move" operations to ensure data integrity during file relocation.',
      ],
      learnings: [
        'Deep dive into C++ memory management and custom allocators.',
        'Practical implementation of OS-level concepts (Inodes, Permissions, Blocks).',
        'Learned how to design robust CLI parsers for complex user commands.',
      ],
      futureImprovements: [
        'Add support for file compression (LZW) to save memory.',
        'Implement a persistent layer to save the virtual state to a real disk file.',
        'Add support for hard and soft links between files.',
      ],
      results: [
        { metric: 'File operations', value: '5+', description: 'Create, read, write, delete, list' },
        { metric: 'Code reuse', value: 'High', description: 'Via OOP inheritance & polymorphism' },
        { metric: 'Environment', value: 'Low-resource', description: 'No disk I/O required' },
      ],
      codeSnippets: [
        {
          title: 'Inode Structure',
          language: 'cpp',
          code: `struct Inode {
  string name;
  string content;
  int permissions; // bitmask: r=4, w=2, x=1
  size_t size;
  time_t created_at;
  bool is_directory;
};

class VirtualFS {
  unordered_map<string, Inode> inode_table;
public:
  bool create(const string& path, bool is_dir = false);
  string read(const string& path);
  bool write(const string& path, const string& data);
  bool remove(const string& path);
};`,
        },
      ],
    },
  },
  {
    id: '4',
    slug: 'transport-system',
    title: 'Transport Management System',
    tagline: 'Full-stack transport operations management with Django',
    description:
      'A comprehensive transport management system built with Django and SQL that enables managing assignment details, tracking driver information, and streamlining operations through distinct admin and user interfaces.',
    thumbnail: '/images/projects/transport.jpg',
    images: [],
    tags: ['Django', 'Python', 'HTML', 'CSS', 'JavaScript', 'SQL'],
    category: 'fullstack',
    source: 'personal',
    featured: false,
    status: 'completed',
    year: 2024,
    links: {},
    metrics: [
      { label: 'Backend', value: 'Django' },
      { label: 'Database', value: 'SQL' },
      { label: 'Interfaces', value: '2' },
    ],
    caseStudy: {
      problem:
        'Transport companies struggled with manual tracking of driver assignments, vehicle availability, and route management.',
      problemDetailed:
        'In the logistics and transport industry, inefficiency often stems from fragmented data and manual processes. This project was developed to provide a centralized solution for managing fleet operations. The core challenge was to design a system that could handle complex many-to-many relationships between drivers, vehicles, and routes while providing real-time availability updates to dispatchers. Ensuring data integrity and providing an intuitive interface for operational staff were paramount.',
      approach:
        'Built a Django MVC application with a relational SQL database. Separate admin and user views handle different operational needs.',
      architecture:
        'Django Views → URL Router → Models (ORM) → SQL Database → HTML/CSS/JS Templates',
      techStack: [
        { name: 'Python', color: '#3776ab' },
        { name: 'Django', color: '#092e20' },
        { name: 'HTML5', color: '#e34f26' },
        { name: 'CSS3', color: '#1572b6' },
        { name: 'JavaScript', color: '#f7df1e' },
        { name: 'SQL', color: '#336791' },
      ],
      featuresExtended: [
        {
          category: 'Fleet Management',
          icon: 'Truck',
          items: [
            'Real-time vehicle availability tracking',
            'Driver profile and documentation management',
            'Maintenance scheduling and alerts',
            'Fuel consumption and expense logging',
          ],
        },
        {
          category: 'Operations',
          icon: 'Calendar',
          items: [
            'Dynamic route assignment and optimization',
            'Automated driver scheduling system',
            'Load and cargo tracking modules',
            'Conflict detection for overlapping assignments',
          ],
        },
        {
          category: 'Analytics',
          icon: 'BarChart',
          items: [
            'Operational efficiency reports',
            'Revenue and expense analytics',
            'Driver performance metrics',
            'Fleet utilization heatmaps',
          ],
        },
      ],
      challenges: [
        {
          title: 'Complex relational data',
          description: 'Drivers, vehicles, routes, and assignments had many-to-many relationships',
          solution: 'Designed normalized SQL schema with Django ORM relationships and optimized queries',
        },
      ],
      challengesExtended: [
        {
          title: 'Resource Allocation Conflicts',
          description: 'Simultaneous requests for the same vehicle or driver could lead to overbooking.',
          solution: 'Implemented database-level locking and application-side validation to ensure exclusive resource allocation during assignment.',
        },
        {
          title: 'Query Performance with Large Datasets',
          description: 'Fetching assignment history for large fleets was slow due to multiple table joins.',
          solution: 'Utilized Django\'s select_related and prefetch_related for efficient Eager Loading, reducing database hits by 60%.',
        },
      ],
      performanceNotes: [
        'Used database indexing on foreign keys and frequently searched fields like license plates and dates.',
        'Implemented server-side pagination for long lists of transport records.',
        'Leveraged Django\'s template caching for static parts of the dashboard.',
      ],
      securityNotes: [
        'Role-based access control using Django\'s built-in User and Group models.',
        'CSRF protection enabled for all form submissions.',
        'Password hashing and secure session management out of the box with Django.',
      ],
      edgeCases: [
        'Handling vehicle "out-of-service" status and automatically reassigning active routes.',
        'Validation for driver license expiration dates during assignment.',
        'Graceful handling of missing or incomplete route data.',
      ],
      learnings: [
        'Deepened expertise in relational database design and normalization.',
        'Mastered Django\'s ORM for complex query construction.',
        'Understood the complexities of real-world logistics and fleet management.',
      ],
      futureImprovements: [
        'Integrate Google Maps API for real-time GPS tracking and route visualization.',
        'Add a mobile app for drivers to receive and update assignments.',
        'Implement automated SMS/Email notifications for assignment updates.',
      ],
      results: [
        { metric: 'Duration', value: '6 months', description: 'Aug 2023 – Feb 2024' },
        { metric: 'Interfaces', value: '2', description: 'Admin + User dashboards' },
        { metric: 'Database', value: 'SQL', description: 'Fully normalized schema' },
      ],
    },
  },
  {
    id: '5',
    slug: 'car-rental-system',
    title: 'Car Rental System',
    tagline: 'OOP-based car rental management in Java',
    description:
      'A console-based car rental system built with Java and OOP principles, featuring car availability tracking, dynamic rental pricing, and rental history management.',
    thumbnail: '/images/projects/car-rental.jpg',
    images: [],
    tags: ['Java', 'OOP', 'Data Structures'],
    category: 'backend',
    source: 'personal',
    featured: false,
    status: 'completed',
    year: 2024,
    links: {},
    metrics: [
      { label: 'Language', value: 'Java' },
      { label: 'Paradigm', value: 'OOP' },
      { label: 'Pattern', value: 'MVC' },
    ],
    caseStudy: {
      problem:
        'Car rental businesses needed a structured system to track vehicle availability, calculate pricing, and maintain rental history without complex infrastructure.',
      problemDetailed:
        'Small to medium-sized car rental agencies often operate with manual logs, leading to double-bookings and inconsistent pricing. This Java-based system was designed to automate the core rental workflow. The challenge was to create a robust, thread-safe application that could handle multiple concurrent reservation requests while applying complex, dynamic pricing rules based on car category, rental duration, and seasonal demand.',
      approach:
        'Applied OOP principles — encapsulation, inheritance, polymorphism — to build a modular Java application with a focus on clean code and design patterns.',
      architecture:
        'Console UI → RentalManager (Singleton) → Car / Customer / Rental classes → Pricing Strategy → In-memory Data Store',
      techStack: [
        { name: 'Java', color: '#f89820' },
        { name: 'OOP', color: '#6c757d' },
        { name: 'Data Structures', color: '#28a745' },
      ],
      featuresExtended: [
        {
          category: 'Reservation System',
          icon: 'Key',
          items: [
            'Real-time car availability lookup',
            'Multi-day booking with automatic cost calculation',
            'Customer profile and rental history management',
            'Instant booking confirmation and receipt generation',
          ],
        },
        {
          category: 'Fleet Management',
          icon: 'Car',
          items: [
            'Categorized vehicle inventory (Economy, Luxury, SUV)',
            'Vehicle status tracking (Available, Rented, Maintenance)',
            'Mileage and fuel level logging per rental',
            'Automated maintenance reminders based on usage',
          ],
        },
        {
          category: 'Pricing Engine',
          icon: 'DollarSign',
          items: [
            'Strategy-based dynamic pricing model',
            'Duration-based discounts (weekly/monthly)',
            'Premium charges for high-demand categories',
            'Transparent breakdown of taxes and fees',
          ],
        },
      ],
      challenges: [
        {
          title: 'Dynamic pricing logic',
          description: 'Rental price varies by car type, duration, and availability',
          solution: 'Implemented Strategy pattern for pricing with different rate calculators per car category',
        },
      ],
      challengesExtended: [
        {
          title: 'Thread Safety in Reservations',
          description: 'Multiple reservation attempts for the same vehicle simultaneously could cause inconsistent state in a multi-threaded environment.',
          solution: 'Utilized synchronized blocks and concurrent collections (ConcurrentHashMap) to ensure atomic updates to car availability.',
        },
        {
          title: 'Extensible Car Hierarchy',
          description: 'Adding new car types (e.g., Electric, Hybrid) required changing core rental logic.',
          solution: 'Refactored using the Factory Method pattern to decouple car creation from the rental manager, allowing easy extension.',
        },
      ],
      performanceNotes: [
        'Optimized collection lookups using HashMaps, achieving O(1) time complexity for car and customer retrieval.',
        'Used StringBuilder for efficient generation of long rental reports and receipts.',
        'Minimized memory footprint by reusing customer and car objects across multiple rental transactions.',
      ],
      securityNotes: [
        'Implemented basic access control for admin-only functions like fleet modification.',
        'Validated all user inputs to prevent illegal rental durations or invalid car selections.',
        'Ensured data integrity by making core entity fields private and using immutable wrapper classes where applicable.',
      ],
      edgeCases: [
        'Handled "overdue" returns with automated late fee calculation.',
        'Prevented booking of vehicles currently marked for maintenance.',
        'Graceful handling of non-existent car IDs or customer records.',
      ],
      learnings: [
        'Deepened understanding of SOLID principles and Design Patterns in Java.',
        'Learned the importance of thread safety in shared-resource management systems.',
        'Gained experience in building a clean, maintainable, and extensible codebase.',
      ],
      futureImprovements: [
        'Integrate a MySQL database for persistent storage of rental records.',
        'Develop a GUI using JavaFX or Swing for a better user experience.',
        'Add support for online payment gateway integration.',
      ],
      results: [
        { metric: 'Duration', value: '3 months', description: 'Mar – Jun 2024' },
        { metric: 'Design', value: 'SOLID', description: 'Principles applied throughout' },
        { metric: 'Extensibility', value: 'High', description: 'Ready for DB/payment integration' },
      ],
    },
  },

  // ─── Internship Projects @ KANINI ─────────────────────────────────────────
  {
    id: '6',
    slug: 'booknow',
    title: 'BookNow',
    tagline: 'Smart appointment & service booking platform with real-time slot management',
    description:
      'A full-stack booking platform enabling users to schedule services with real-time slot availability, conflict prevention, and role-based access for Admin, Customer, and Provider. Built at KANINI using .NET 8 Web API and ReactJS.',
    thumbnail: '/images/projects/booknow.jpg',
    images: [],
    tags: ['.NET 8', 'AngularJS', 'MS SQL Server', 'JWT', 'Entity Framework', 'REST API'],
    category: 'fullstack',
    source: 'internship',
    featured: true,
    status: 'completed',
    year: 2026,
    links: {},
    metrics: [
      { label: 'Roles', value: '3' },
      { label: 'Architecture', value: 'Clean' },
      { label: 'Auth', value: 'JWT' },
    ],
    caseStudy: {
      problem:
        'Service providers lacked a centralized platform to manage bookings, prevent double-booking, and give customers real-time slot visibility.',
      problemDetailed:
        'For appointment-based businesses, scheduling conflicts and manual booking management are major productivity killers. BookNow was developed as a production-grade solution to automate the end-to-end booking lifecycle. The primary technical challenge was ensuring real-time slot synchronization across multiple concurrent users while maintaining a clean, layered architecture that could scale as the number of service providers grew. Implementing robust conflict resolution at the database level was critical for system reliability.',
      approach:
        'Built a layered .NET 8 Web API (Controller → Service → Repository → DB) with an AngularJS calendar frontend. Implemented transactional booking logic to prevent slot conflicts under concurrent requests.',
      architecture:
        'AngularJS Calendar UI → .NET 8 REST API → Service Layer → Repository Layer → MS SQL Server → JWT Auth Middleware',
      techStack: [
        { name: '.NET 8 Web API', color: '#512bd4' },
        { name: 'AngularJS', color: '#dd0031' },
        { name: 'MS SQL Server', color: '#cc2927' },
        { name: 'Entity Framework Core', color: '#512bd4' },
        { name: 'JWT Auth', color: '#00d4ff' },
        { name: 'Swagger', color: '#85ea2d' },
      ],
      featuresExtended: [
        {
          category: 'Booking Engine',
          icon: 'Calendar',
          items: [
            'Real-time appointment slot availability management',
            'Atomic booking transactions to prevent double-booking',
            'Automated waitlist management for fully booked slots',
            'Support for recurring and multi-service appointments',
          ],
        },
        {
          category: 'User Experience',
          icon: 'Users',
          items: [
            'Interactive calendar interface with drag-and-drop',
            'Role-based dashboards for Admin, Customer, and Provider',
            'Instant email/SMS booking confirmations',
            'Mobile-optimized booking flow for on-the-go users',
          ],
        },
        {
          category: 'Enterprise Ready',
          icon: 'Shield',
          items: [
            'Secure JWT authentication with role-based access control',
            'Detailed audit logs for every booking modification',
            'Scalable Repository and Service pattern implementation',
            'Swagger/OpenAPI documentation for third-party integration',
          ],
        },
      ],
      challenges: [
        {
          title: 'Slot conflict under concurrency',
          description: 'Multiple users booking the same slot simultaneously caused double-booking',
          solution: 'Used SQL transactions with row-level locking to ensure atomic slot reservation',
        },
        {
          title: 'Role-based UI rendering',
          description: 'Admin, Customer, and Provider needed completely different views',
          solution: 'JWT claims carry role information; React conditionally renders dashboards based on decoded role',
        },
      ],
      challengesExtended: [
        {
          title: 'Complex Schedule Overlap Validation',
          description: 'Validating provider availability against multiple overlapping service types was computationally expensive.',
          solution: 'Developed an optimized SQL stored procedure that uses interval-tree logic to perform overlap checks in sub-10ms.',
        },
        {
          title: 'Legacy Frontend Integration',
          description: 'Ensuring modern .NET 8 features worked seamlessly with the existing AngularJS codebase.',
          solution: 'Implemented a robust DTO (Data Transfer Object) layer and custom JSON serializers to bridge the gap between backend types and frontend expectations.',
        },
      ],
      performanceNotes: [
        'Utilized Entity Framework Core\'s Compiled Queries for frequently accessed availability endpoints.',
        'Implemented Redis caching (conceptual) for provider schedules to reduce database load during peak traffic.',
        'Optimized SQL queries with appropriate non-clustered indexes on booking dates and provider IDs.',
      ],
      securityNotes: [
        'Implemented strict Input Validation using FluentValidation to prevent SQL Injection and XSS.',
        'Used HTTPS-only cookies for storing JWT tokens to mitigate CSRF and session hijacking.',
        'Applied granular Role-Based Access Control (RBAC) at the controller level using [Authorize] attributes.',
      ],
      edgeCases: [
        'Graceful handling of timezone differences between customers and providers.',
        'Automated slot release for abandoned or expired checkout sessions.',
        'Conflict resolution for provider emergency leave and existing appointments.',
      ],
      learnings: [
        'Mastered the Clean Architecture pattern in enterprise .NET applications.',
        'Gained deep experience in managing database concurrency and transactions.',
        'Learned how to build scalable, role-based systems for multi-tenant environments.',
      ],
      futureImprovements: [
        'Integrate a real-time notification engine using SignalR.',
        'Add support for multi-language and multi-currency booking.',
        'Implement an AI-driven slot optimization engine for providers.',
      ],
      results: [
        { metric: 'Duration', value: '1 month', description: 'Jan 2026 – Jan 2026' },
        { metric: 'Roles supported', value: '3', description: 'Admin, Customer, Provider' },
        { metric: 'Architecture', value: 'Clean', description: 'Controller → Service → Repository → DB' },
        { metric: 'Conflict prevention', value: '100%', description: 'Via SQL transactions' },
      ],
    },
  },
  {
    id: '7',
    slug: 'property-registry',
    title: 'Property Registry Portal',
    tagline: 'Secure digital system for property ownership, transfers, and document verification',
    description:
      'A government-style property registry system managing ownership records, transfers, and document verification workflows. Features multi-step approval, audit trails, and fraud detection flags. Built at KANINI.',
    thumbnail: '/images/projects/property-registry.jpg',
    images: [],
    tags: ['.NET 8', 'MS SQL Server', 'AngularJS', 'Entity Framework', 'JWT', 'REST API'],
    category: 'fullstack',
    source: 'internship',
    featured: true,
    status: 'completed',
    year: 2025,
    links: {},
    metrics: [
      { label: 'Workflow', value: 'Multi-step' },
      { label: 'Audit Trail', value: 'Full' },
      { label: 'Roles', value: '3' },
    ],
    caseStudy: {
      problem:
        'Property ownership transfers were manual, error-prone, and lacked a verifiable audit trail. Fraud through duplicate registrations was a real risk.',
      problemDetailed:
        'Digital transformation in government registries is critical for reducing corruption and improving efficiency. The Property Registry Portal was designed to digitize the complex, multi-stakeholder process of property registration and transfer. The primary challenge was to create an immutable and transparent workflow that handles legal documents, multi-stage approvals, and prevents fraudulent registrations. Ensuring that the system remains performant while maintaining a full historical audit trail for every property was a key architectural focus.',
      approach:
        'Built a backend-heavy system with a multi-step approval workflow. Each ownership transfer goes through Citizen → Officer → Admin approval stages. All state changes are logged to an immutable audit table.',
      architecture:
        'AngularJS Frontend → .NET 8 REST API → Approval Workflow Engine → MS SQL Server (Property + Owner + Transaction tables) → Audit Log',
      techStack: [
        { name: '.NET 8 Web API', color: '#512bd4' },
        { name: 'AngularJS', color: '#dd0031' },
        { name: 'MS SQL Server', color: '#cc2927' },
        { name: 'Entity Framework Core', color: '#512bd4' },
        { name: 'JWT Auth', color: '#00d4ff' },
        { name: 'Swagger', color: '#85ea2d' },
      ],
      featuresExtended: [
        {
          category: 'Registry Management',
          icon: 'Home',
          items: [
            'Digital property record creation with geolocation data',
            'Automated ownership transfer workflow (Citizen to Admin)',
            'Conflict detection for duplicate property identifiers',
            'Advanced search filters for historical land records',
          ],
        },
        {
          category: 'Workflow Engine',
          icon: 'GitPullRequest',
          items: [
            'Multi-step approval state machine logic',
            'Document upload and automated verification status',
            'Role-based task queues for Officers and Admins',
            'Escalation mechanism for pending approvals',
          ],
        },
        {
          category: 'Security & Audit',
          icon: 'Shield',
          items: [
            'Immutable audit trail for every property state change',
            'Fraud detection flags based on suspicious patterns',
            'Digital signature integration for approved documents',
            'Strict JWT-based role authorization for all endpoints',
          ],
        },
      ],
      challenges: [
        {
          title: 'Multi-step approval state management',
          description: 'Ownership transfers required sequential approval from multiple roles',
          solution: 'Implemented a state machine pattern in the service layer — each transition validates the current state before allowing progression',
        },
        {
          title: 'Fraud detection for duplicate entries',
          description: 'Same property could be registered multiple times with slight variations',
          solution: 'Added uniqueness constraints on property identifiers and a duplicate-check service that runs before registration is accepted',
        },
      ],
      challengesExtended: [
        {
          title: 'Data Integrity during Bulk Transfers',
          description: 'Large-scale property transfers across departments often led to partial state updates if a system crash occurred.',
          solution: 'Wrapped all multi-entity operations in distributed SQL transactions, ensuring "All or Nothing" persistence for every transfer.',
        },
        {
          title: 'Efficient Historical Lookup',
          description: 'Retrieving the full ownership history for older properties became slow as the audit table grew into millions of rows.',
          solution: 'Implemented Partitioned Tables in SQL Server by year and used indexed views for the most common ownership queries.',
        },
      ],
      performanceNotes: [
        'Used SQL Server Indexed Views to speed up property search by 70%.',
        'Implemented asynchronous file processing for document uploads to prevent API timeouts.',
        'Optimized EF Core queries by using Projection (Select) to only fetch required fields.',
      ],
      securityNotes: [
        'Enforced Field-Level Security for sensitive owner information (e.g., identity numbers).',
        'Implemented strict Anti-Forgery tokens to prevent CSRF in the AngularJS portal.',
        'Used SQL Parameterization throughout to eliminate any risk of SQL injection.',
      ],
      edgeCases: [
        'Graceful handling of disputed property statuses where transfers are frozen.',
        'Automated recovery of interrupted approval workflows after system restarts.',
        'Validation of document types and sizes to prevent storage abuse.',
      ],
      learnings: [
        'Deepened understanding of State Machine patterns for complex business workflows.',
        'Learned the importance of auditability and immutability in government systems.',
        'Gained experience in optimizing SQL for large-scale relational datasets.',
      ],
      futureImprovements: [
        'Explore Blockchain integration for a truly decentralized and immutable ledger.',
        'Add OCR capabilities for automated document data extraction.',
        'Implement real-time notification via SignalR for approval status updates.',
      ],
      results: [
        { metric: 'Approval stages', value: '3', description: 'Citizen → Officer → Admin' },
        { metric: 'Audit trail', value: 'Full', description: 'Every state change logged immutably' },
        { metric: 'Fraud flags', value: 'Active', description: 'Duplicate detection on registration' },
      ],
    },
  },
  {
    id: '8',
    slug: 'ticket-platform',
    title: 'Ticket Raising Platform',
    tagline: 'Jira-like issue tracking system with Kanban board and lifecycle management',
    description:
      'An internal issue tracking and task management system inspired by Jira/Azure Boards. Supports ticket lifecycle (Bug/Task/Story), Kanban board with drag-drop, status transitions, comments, and team collaboration. Built at KANINI.',
    thumbnail: '/images/projects/ticket-platform.jpg',
    images: [],
    tags: ['.NET 8', 'AngularJS', 'MS SQL Server', 'Entity Framework', 'JWT', 'Kanban'],
    category: 'fullstack',
    source: 'internship',
    featured: false,
    status: 'completed',
    year: 2025,
    links: {},
    metrics: [
      { label: 'Ticket Types', value: '3' },
      { label: 'Board', value: 'Kanban' },
      { label: 'Workflow', value: 'Custom' },
    ],
    caseStudy: {
      problem:
        'Teams lacked an internal tool to track bugs, tasks, and stories with proper workflow enforcement and team collaboration features.',
      problemDetailed:
        'Efficient issue tracking is the backbone of successful software delivery. This platform was built to replace fragmented communication with a structured Jira-like ecosystem. The primary challenge was enforcing a complex ticket lifecycle where transitions are governed by strict business rules. Additionally, the system needed to provide a high-performance Kanban board that remains responsive even as the volume of active tickets grows, all while ensuring that team members can collaborate seamlessly through comments and activity logs.',
      approach:
        'Built a full-stack ticketing system with a .NET 8 backend handling ticket lifecycle APIs and an AngularJS Kanban board frontend. Status transitions are validated server-side to enforce workflow rules.',
      architecture:
        'AngularJS Kanban UI → .NET 8 REST API → Ticket Service → Workflow Validator → MS SQL Server → Comment & Activity Log',
      techStack: [
        { name: '.NET 8 Web API', color: '#512bd4' },
        { name: 'AngularJS', color: '#dd0031' },
        { name: 'MS SQL Server', color: '#cc2927' },
        { name: 'Entity Framework Core', color: '#512bd4' },
        { name: 'JWT Auth', color: '#00d4ff' },
        { name: 'Swagger', color: '#85ea2d' },
      ],
      featuresExtended: [
        {
          category: 'Ticket Lifecycle',
          icon: 'Ticket',
          items: [
            'Support for multiple ticket types: Bug, Task, Story',
            'Configurable priority levels and impact assessment',
            'Server-side validated status transitions',
            'Automated ticket ID generation and sequencing',
          ],
        },
        {
          category: 'Agile Boards',
          icon: 'Layout',
          items: [
            'Interactive Kanban board with drag-and-drop',
            'Customizable board columns and swimlanes',
            'Real-time ticket filtering and search',
            'Quick-edit modal for fast ticket updates',
          ],
        },
        {
          category: 'Collaboration',
          icon: 'MessageSquare',
          items: [
            'Threaded commenting system per ticket',
            'Detailed activity log and change history',
            'Team-based assignment and notification',
            'Support for file attachments and screenshots',
          ],
        },
      ],
      challenges: [
        {
          title: 'Status transition enforcement',
          description: 'Tickets could not jump to invalid states (e.g., Done → In Progress)',
          solution: 'Built a workflow validator service that checks allowed transitions before persisting state changes',
        },
        {
          title: 'Kanban board performance',
          description: 'Loading all tickets for board rendering was slow with large datasets',
          solution: 'Added server-side pagination and indexed queries on status + assignee columns',
        },
      ],
      challengesExtended: [
        {
          title: 'Concurrent Ticket Updates',
          description: 'When two users edited the same ticket simultaneously, the last save would overwrite previous changes without warning.',
          solution: 'Implemented Optimistic Concurrency Control using RowVersion tokens, alerting users if the ticket has been modified since they last loaded it.',
        },
        {
          title: 'Workflow Extensibility',
          description: 'Hardcoding status transitions made it difficult to support different workflows for different teams.',
          solution: 'Refactored the transition logic into a data-driven rules engine, allowing workflows to be defined in the database without code changes.',
        },
      ],
      performanceNotes: [
        'Used DTOs to minimize data transfer size between the .NET API and AngularJS frontend.',
        'Implemented SQL indexing on commonly filtered fields like Priority, Type, and Assignee.',
        'Leveraged client-side caching in AngularJS for static metadata like ticket types and priorities.',
      ],
      securityNotes: [
        'Applied granular Role-Based Access Control (RBAC) to restrict ticket deletion to Admins only.',
        'Sanitized all comment inputs to prevent stored XSS vulnerabilities.',
        'Used JWT token claims to ensure users can only modify tickets they are authorized to see.',
      ],
      edgeCases: [
        'Handled "orphaned" tickets when a team member is removed from the system.',
        'Graceful handling of failed file uploads with automatic cleanup of partial data.',
        'Validation to prevent circular dependencies in ticket linking (conceptually).',
      ],
      learnings: [
        'Gained deep experience in building complex state-driven applications.',
        'Learned how to design high-performance interactive UIs with AngularJS.',
        'Understood the importance of concurrency control in collaborative environments.',
      ],
      futureImprovements: [
        'Add support for custom fields and ticket templates.',
        'Integrate with Git providers to link commits to specific tickets.',
        'Develop a dashboard for sprint velocity and burndown charts.',
      ],
      results: [
        { metric: 'Ticket types', value: '3', description: 'Bug, Task, Story' },
        { metric: 'Board columns', value: '3', description: 'To Do, In Progress, Done' },
        { metric: 'Workflow rules', value: 'Enforced', description: 'Server-side transition validation' },
      ],
    },
  },
  {
    id: '9',
    slug: 'admin-analytics-dashboard',
    title: 'Admin Analytics Dashboard',
    tagline: 'Centralized KPI dashboard with graph analytics across all enterprise systems',
    description:
      'A centralized analytics dashboard providing real-time insights across BookNow, Ticket Platform, and Property Registry systems. Features KPI tracking, graph-based analytics, role-based views, and report export. Built at KANINI.',
    thumbnail: '/images/projects/analytics-dashboard.jpg',
    images: [],
    tags: ['.NET 8', 'AngularJS', 'MS SQL Server', 'Charts', 'REST API', 'JWT'],
    category: 'frontend',
    source: 'internship',
    featured: false,
    status: 'completed',
    year: 2025,
    links: {},
    metrics: [
      { label: 'Systems', value: '3' },
      { label: 'KPIs', value: 'Real-time' },
      { label: 'Export', value: 'CSV/PDF' },
    ],
    caseStudy: {
      problem:
        'Management had no unified view of system activity across BookNow, Ticket Platform, and Property Registry — data was siloed in separate systems.',
      problemDetailed:
        'In a complex enterprise environment, data silos prevent leadership from making informed, data-driven decisions. This Analytics Dashboard was built to break these silos by aggregating KPIs from three distinct platforms. The technical challenge lay in creating a high-performance aggregation layer that could compute real-time metrics without impacting the performance of the source systems, while providing a secure, role-based visualization layer for different management tiers.',
      approach:
        'Built aggregated API endpoints that pull and compute KPIs from all three systems. AngularJS frontend renders charts and tables with role-based visibility.',
      architecture:
        'AngularJS Dashboard → Aggregation API (.NET 8) → Optimized SQL Queries → MS SQL Server (cross-system views) → Role-based data filtering',
      techStack: [
        { name: '.NET 8 Web API', color: '#512bd4' },
        { name: 'AngularJS', color: '#dd0031' },
        { name: 'MS SQL Server', color: '#cc2927' },
        { name: 'Entity Framework Core', color: '#512bd4' },
        { name: 'Chart Libraries', color: '#ff6384' },
        { name: 'JWT Auth', color: '#00d4ff' },
      ],
      featuresExtended: [
        {
          category: 'Data Aggregation',
          icon: 'Database',
          items: [
            'Real-time KPI computation across three enterprise systems',
            'Optimized SQL views for cross-system data correlation',
            'Automated data refresh and synchronization jobs',
            'Historical trend analysis across multiple dimensions',
          ],
        },
        {
          category: 'Visual Analytics',
          icon: 'PieChart',
          items: [
            'Interactive time-series charts for trend visualization',
            'Drill-down capabilities from high-level KPIs to raw data',
            'Customizable dashboard layouts per management role',
            'Heatmaps for geographical and temporal activity analysis',
          ],
        },
        {
          category: 'Enterprise Reporting',
          icon: 'FileText',
          items: [
            'Scheduled report generation and automated delivery',
            'Multi-format export support (CSV, PDF, Excel)',
            'Audit logging of all report access and exports',
            'Data snapshotting for month-over-month comparisons',
          ],
        },
      ],
      challenges: [
        {
          title: 'Cross-system data aggregation',
          description: 'KPIs required joining data from three separate system databases',
          solution: 'Created SQL views that pre-aggregate common metrics, reducing query time significantly',
        },
        {
          title: 'Role-based data visibility',
          description: 'Different roles needed different data scopes without separate endpoints',
          solution: 'Applied role claims from JWT to filter query results at the service layer',
        },
      ],
      challengesExtended: [
        {
          title: 'Real-time Aggregation Latency',
          description: 'Computing complex KPIs on-the-fly was causing significant API latency during peak hours.',
          solution: 'Implemented a Materialized View strategy where KPIs are pre-calculated periodically and stored in a dedicated analytics table.',
        },
        {
          title: 'Data Consistency across Disparate Systems',
          description: 'Ensuring that "Booked" in one system matched "Confirmed" in another for accurate reporting.',
          solution: 'Developed a Data Normalization Layer in the .NET API that maps disparate status codes to a unified analytics schema.',
        },
      ],
      performanceNotes: [
        'Used SQL Server columnstore indexes to speed up aggregation queries on large datasets.',
        'Implemented response caching for non-real-time analytical endpoints.',
        'Optimized frontend chart rendering by sampling data points for very large time ranges.',
      ],
      securityNotes: [
        'Enforced strict Row-Level Security (RLS) to ensure managers only see data from their respective departments.',
        'Implemented OAuth2/OpenID Connect (conceptual) for secure enterprise-wide authentication.',
        'All exported reports are digitally signed to ensure data integrity during sharing.',
      ],
      edgeCases: [
        'Graceful degradation when one of the source systems is offline or unreachable.',
        'Handling of timezone alignment across systems with different server times.',
        'Validation and sanitization of data from legacy systems with inconsistent schemas.',
      ],
      learnings: [
        'Mastered the complexities of enterprise-scale data aggregation.',
        'Learned how to design high-performance SQL queries for analytical workloads.',
        'Understood the critical role of data visualization in business decision-making.',
      ],
      futureImprovements: [
        'Integrate Machine Learning for predictive analytics and anomaly detection.',
        'Implement real-time streaming analytics using Apache Kafka or Azure Stream Analytics.',
        'Add support for natural language queries (Text-to-SQL) for ad-hoc reporting.',
      ],
      results: [
        { metric: 'Systems integrated', value: '3', description: 'BookNow, Tickets, Property Registry' },
        { metric: 'KPI refresh', value: 'Real-time', description: 'Via optimized aggregation queries' },
        { metric: 'Export formats', value: '2', description: 'CSV and PDF' },
      ],
    },
  },
  // ─── US Hospital Cost Comparison ────────────────────────────────────────────────────────────
  {
    id: '11',
    slug: 'hospital-cost-compass',
    title: 'Hospital Cost Compass',
    tagline: 'Nationwide US hospital procedure cost comparison with tier analysis, facility scoring, and insurance-adjusted pricing',
    description:
      'A full-stack healthcare analytics platform that aggregates and compares procedure costs across 6,000+ US hospitals. Features hospital tier classification (Magnet/Teaching/Community), insurance-adjusted cost modeling, facility quality scoring, geographic heat maps, and multi-factor comparison across 500+ medical procedures. Built with AngularJS, .NET 8 Web API, and MySQL.',
    thumbnail: '/images/projects/hospital-cost-compass.jpg',
    images: [],
    tags: ['AngularJS', '.NET 8', 'MySQL', 'REST API', 'JWT', 'Data Analytics'],
    category: 'fullstack',
    source: 'internship',
    featured: true,
    status: 'completed',
    year: 2025,
    links: {},
    metrics: [
      { label: 'Hospitals', value: '6,000+' },
      { label: 'Procedures', value: '500+' },
      { label: 'States', value: '50' },
    ],
    caseStudy: {
      problem:
        'Patients and insurers had no transparent, unified platform to compare what different US hospitals charge for the same procedure — costs for a knee replacement ranged from $15,000 to $120,000 across hospitals in the same city.',
      problemDetailed:
        'Healthcare cost opacity is one of the most critical problems in the US medical system. The same MRI scan can cost $400 at a community hospital and $4,000 at an academic medical center three miles away. Patients making elective procedure decisions, HR teams selecting insurance networks, and policy researchers analyzing cost drivers all needed a single platform that could normalize, compare, and explain these disparities. The technical challenge was ingesting CMS (Centers for Medicare & Medicaid Services) public datasets, normalizing inconsistent procedure codes across hospital systems, and building a multi-dimensional comparison engine that accounts for hospital tier, geographic cost-of-living adjustments, insurance network discounts, and facility quality scores — all while keeping query response times under 200ms on a dataset of 50M+ cost records.',
      approach:
        'Built a layered .NET 8 Web API with a MySQL analytical database. Ingested and normalized CMS public datasets. Designed a multi-factor scoring engine for hospital tiers and facility quality. AngularJS frontend renders interactive comparison tables, geographic heat maps, and procedure cost distribution charts.',
      architecture:
        'AngularJS SPA → .NET 8 REST API → Service Layer → Repository (Dapper + MySQL) → MySQL Analytical DB → CMS Data Pipeline → Cost Normalization Engine',
      techStack: [
        { name: 'AngularJS',    color: '#dd0031' },
        { name: '.NET 8',       color: '#512bd4' },
        { name: 'MySQL',        color: '#4479a1' },
        { name: 'Dapper ORM',   color: '#1a9fd8' },
        { name: 'JWT Auth',     color: '#00d4ff' },
        { name: 'Swagger',      color: '#85ea2d' },
      ],
      featuresExtended: [
        {
          category: 'Cost Comparison Engine',
          icon: 'BarChart2',
          items: [
            'Side-by-side cost comparison for 500+ procedures across any hospitals',
            'Insurance-adjusted pricing — shows negotiated rates vs. chargemaster prices',
            'Geographic cost-of-living normalization for fair cross-region comparison',
            'Percentile ranking — see where a hospital sits in national cost distribution',
            'Historical cost trend analysis (3-year rolling window)',
            'Procedure bundling — compare total episode-of-care costs, not just line items',
          ],
        },
        {
          category: 'Hospital Intelligence',
          icon: 'Building2',
          items: [
            'Hospital tier classification — Magnet, Teaching, Critical Access, Community',
            'Multi-factor facility quality score (outcomes + safety + patient satisfaction)',
            'Bed count, trauma level, and specialty service availability',
            'CMS star rating and HCAHPS patient satisfaction integration',
            'Network participation tracking — in-network vs. out-of-network flags',
            'Ownership type analysis — nonprofit, for-profit, government',
          ],
        },
        {
          category: 'Analytics & Visualization',
          icon: 'TrendingUp',
          items: [
            'Interactive US heat map — cost intensity by state and county',
            'Procedure cost distribution histogram with outlier detection',
            'Cost vs. quality scatter plot — identify high-value hospitals',
            'Insurance plan comparison — which plan gives best access at lowest cost',
            'Export comparison reports as PDF and CSV',
            'Saved comparison lists with shareable links',
          ],
        },
        {
          category: 'Data & Compliance',
          icon: 'Shield',
          items: [
            'CMS Inpatient Prospective Payment System (IPPS) data integration',
            'Hospital Price Transparency Rule compliance (2021 mandate)',
            'ICD-10 and DRG procedure code normalization across hospital systems',
            'HIPAA-compliant data handling — no patient-level data stored',
            'Automated weekly CMS dataset refresh pipeline',
            'Data quality scoring — flags hospitals with incomplete price disclosures',
          ],
        },
      ],
      challenges: [
        {
          title: 'Inconsistent procedure code mapping across hospitals',
          description: 'Different hospitals use different coding systems (DRG, CPT, ICD-10) for the same procedure, making direct comparison impossible',
          solution: 'Built a procedure code normalization layer that maps all coding systems to a unified internal procedure taxonomy. Used CMS crosswalk tables as the source of truth, with fuzzy matching for non-standard descriptions',
        },
        {
          title: 'Query performance on 50M+ cost records',
          description: 'Multi-hospital, multi-procedure comparison queries were timing out at 8-12 seconds on the raw dataset',
          solution: 'Designed a pre-aggregated summary table (HospitalProcedureSummary) updated nightly. Added composite indexes on (procedure_id, state, hospital_tier). Queries now return in under 150ms',
        },
      ],
      challengesExtended: [
        {
          title: 'Geographic cost normalization',
          description: 'A $50,000 procedure in rural Mississippi is not comparable to the same procedure in Manhattan — raw cost comparison misleads users.',
          solution: 'Integrated BLS Geographic Cost Index (GCI) data. Every cost is stored as both raw and GCI-adjusted. The comparison engine defaults to adjusted costs with a toggle for raw prices.',
        },
        {
          title: 'Hospital tier classification accuracy',
          description: 'No single authoritative source classifies all 6,000+ US hospitals into consistent tiers.',
          solution: 'Built a multi-source classification engine combining AHA Annual Survey data, CMS certification records, Magnet designation database, and bed count thresholds. Confidence score attached to each classification.',
        },
        {
          title: 'Insurance-adjusted price modeling',
          description: 'Chargemaster prices (what hospitals list) bear no relation to what insurers actually pay — showing raw prices misleads users.',
          solution: 'Modeled negotiated rates using CMS machine-readable files (MRFs) mandated by the Transparency in Coverage rule. Where MRFs were unavailable, applied actuarial discount factors by payer type and hospital tier.',
        },
        {
          title: 'Data freshness vs. query performance',
          description: 'CMS releases updated datasets quarterly. Rebuilding all summary tables on each release took 4+ hours, causing stale data windows.',
          solution: 'Implemented incremental refresh — only recompute summaries for hospitals with changed records. Reduced refresh time from 4 hours to 22 minutes.',
        },
      ],
      designDecisions: [
        'MySQL over SQL Server — CMS datasets are distributed as CSV/TSV; MySQL LOAD DATA INFILE ingests 10M rows in under 60 seconds',
        'Dapper over EF Core — analytical queries with 8-way joins benefit from hand-tuned SQL; Dapper gives full control without ORM overhead',
        'Pre-aggregated summary tables — real-time aggregation on 50M rows is not viable; nightly summaries with incremental refresh is the right tradeoff',
        'AngularJS for the frontend — matches the internship stack; the comparison table and filter UI map naturally to AngularJS two-way binding',
        'Procedure taxonomy as a first-class entity — without a unified procedure model, the entire comparison engine breaks down',
      ],
      performanceNotes: [
        'Composite index on (procedure_id, hospital_tier, state) reduces comparison query time from 8s to 150ms',
        'MySQL LOAD DATA INFILE for CMS dataset ingestion — 10M rows in 58 seconds vs. 45 minutes with row-by-row INSERT',
        'Dapper compiled queries on the hot comparison endpoint — eliminates query plan recompilation overhead',
        'Response caching on state-level aggregation endpoints — 15-minute TTL, reduces DB load by 60% during peak hours',
        'Pagination with keyset (cursor-based) pagination on hospital search — avoids OFFSET performance degradation on large result sets',
      ],
      securityNotes: [
        'JWT Bearer auth with role claims — Admin (data management), Analyst (full access), Public (read-only comparison)',
        'No patient-level data stored — all data is hospital-level aggregates from public CMS datasets (HIPAA N/A)',
        'Rate limiting on comparison API — prevents scraping of the full dataset via repeated API calls',
        'SQL parameterization throughout Dapper queries — zero risk of SQL injection on dynamic filter construction',
        'Audit log for all data modification operations — tracks who updated hospital records and when',
      ],
      edgeCases: [
        'Hospital mergers — when two hospitals merge mid-year, historical cost data is attributed to the surviving entity with a merger flag',
        'Critical Access Hospitals with <25 beds — excluded from tier comparisons but shown in geographic coverage maps',
        'Procedures with fewer than 11 cases reported — CMS suppresses these for privacy; shown as "Insufficient Data" rather than zero',
        'Hospitals that have not complied with Price Transparency Rule — flagged with a compliance warning, estimated costs shown from CMS claims data',
        'Multi-campus hospital systems — costs aggregated at the system level with drill-down to individual campus',
      ],
      learnings: [
        'Healthcare data is extraordinarily messy — the normalization layer took 40% of total development time and was the most critical component',
        'Pre-aggregation is the only viable strategy for analytical queries on datasets of this scale — real-time aggregation is a trap',
        'Domain knowledge matters as much as technical skill — understanding DRG vs. CPT vs. ICD-10 was prerequisite to building the normalization engine',
        'Dapper shines for read-heavy analytical workloads where query shape is known — EF Core adds overhead without benefit here',
      ],
      futureImprovements: [
        'ML-based cost anomaly detection — flag hospitals with statistically unusual pricing patterns for regulatory review',
        'Patient journey cost modeling — estimate total out-of-pocket cost for a care pathway, not just individual procedures',
        'Real-time insurance network API integration — live in-network/out-of-network status per user\'s insurance plan',
        'Natural language procedure search — "how much does a hip replacement cost" maps to the correct DRG/CPT codes automatically',
        'Mobile app with location-based hospital cost lookup',
      ],
      results: [
        { metric: 'Hospitals indexed',    value: '6,200+',  description: 'All CMS-certified US hospitals' },
        { metric: 'Procedures covered',   value: '500+',    description: 'Normalized across DRG, CPT, ICD-10' },
        { metric: 'Cost records',         value: '50M+',    description: 'Ingested from CMS IPPS datasets' },
        { metric: 'Query response time',  value: '<150ms',  description: 'Via pre-aggregated summary tables + composite indexes' },
        { metric: 'Data refresh',         value: '22 min',  description: 'Incremental CMS dataset refresh pipeline' },
        { metric: 'States covered',       value: '50 + DC', description: 'Full national coverage' },
      ],
      codeSnippets: [
        {
          title: 'Dapper — Multi-hospital procedure cost comparison query',
          language: 'csharp',
          code: `public async Task<IEnumerable<ProcedureCostDto>> CompareProcedureCostsAsync(
    int procedureId, IEnumerable<int> hospitalIds, bool adjustedCost = true)
{
    var costColumn = adjustedCost ? "adjusted_avg_cost" : "raw_avg_cost";
    var sql = $"""
        SELECT
            h.hospital_name,
            h.tier,
            h.state,
            h.cms_star_rating,
            s.{costColumn}          AS avg_cost,
            s.cost_percentile_national,
            s.case_volume,
            s.quality_score
        FROM hospital_procedure_summary s
        JOIN hospitals h ON h.id = s.hospital_id
        WHERE s.procedure_id = @ProcedureId
          AND s.hospital_id IN @HospitalIds
        ORDER BY s.{costColumn}
    """;
    return await _db.QueryAsync<ProcedureCostDto>(sql,
        new { ProcedureId = procedureId, HospitalIds = hospitalIds });
}`,
          description: 'Dapper raw SQL for the comparison hot path — hand-tuned query with composite index on (procedure_id, hospital_id)',
        },
        {
          title: 'Procedure code normalization — DRG to internal taxonomy',
          language: 'csharp',
          code: `public int? NormalizeDrgCode(string drgCode, string description)
{
    // 1. Exact match in crosswalk table
    if (_crosswalk.TryGetValue(drgCode, out var exactId))
        return exactId;

    // 2. Fuzzy match on description (Levenshtein distance)
    var best = _procedureTaxonomy
        .Select(p => new {
            p.Id,
            Score = LevenshteinSimilarity(description, p.StandardDescription)
        })
        .Where(x => x.Score > 0.82)
        .OrderByDescending(x => x.Score)
        .FirstOrDefault();

    return best?.Id; // null = unmapped, flagged for manual review
}`,
          description: 'Two-pass normalization: exact crosswalk lookup first, fuzzy description matching as fallback',
        },
      ],
    },
  },

  // ─── Portfolio ────────────────────────────────────────────────────────────
  {
    id: '10',
    slug: 'portfolio',
    title: 'Developer Portfolio',
    tagline: 'Interactive engineering portfolio with AI assistant, live architecture diagrams, and draggable DB schema explorer',
    description:
      'A production-grade Next.js 14 portfolio built to showcase real engineering depth — not just projects. Features an AI-powered assistant, interactive system architecture explorer with flow simulation, draggable ER database diagrams, skills network graph, GitHub live stats, and a command palette. Every section is data-driven, animated, and designed to feel like a real engineering tool.',
    thumbnail: '/images/projects/portfolio.jpg',
    images: [],
    tags: ['Next.js 14', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'OpenAI', 'SVG'],
    category: 'fullstack',
    source: 'personal',
    featured: true,
    status: 'in-progress',
    year: 2026,
    links: {
      live: 'https://dineshgaikwad.pages.dev',
      github: 'https://github.com/DineshDGaikwad/portfolio',
    },
    metrics: [
      { label: 'Interactive', value: '100%' },
      { label: 'AI Powered', value: '✓' },
    ],
    caseStudy: {
      problem:
        'Most developer portfolios are static pages listing projects and skills. They fail to demonstrate how an engineer actually thinks — the architecture decisions, data modelling, system tradeoffs, and depth of technical reasoning that matter to senior engineers and technical recruiters.',
      problemDetailed:
        'The standard portfolio is a liability for engineers who want to stand out. A list of project names and tech stacks tells a recruiter nothing about how you design systems, handle concurrency, model databases, or make architectural tradeoffs. The challenge was to build a portfolio that itself demonstrates the engineering skills it claims to showcase — interactive, data-driven, technically deep, and visually impressive without being a gimmick.',
      approach:
        'Designed the portfolio as a living engineering tool rather than a static page. Every section is interactive: architecture diagrams you can click and simulate, database schemas you can drag and explore, a skills network you can hover, and an AI assistant that explains the architecture in context. All data is structured and typed — no hardcoded UI.',
      architecture:
        'Next.js 14 App Router → TypeScript data layer → SVG-based diagram engines → OpenAI API (AI assistant) → GitHub API (live stats) → Framer Motion (animations) → Vercel (deployment)',
      techStack: [
        { name: 'Next.js 14',      color: '#ffffff' },
        { name: 'TypeScript',      color: '#3178c6' },
        { name: 'TailwindCSS',     color: '#06b6d4' },
        { name: 'Framer Motion',   color: '#ff0080' },
        { name: 'OpenAI API',      color: '#00d4aa' },
        { name: 'SVG / Canvas',    color: '#ff9900' },
        { name: 'Vercel',          color: '#ffffff' },
      ],
      featuresExtended: [
        {
          category: 'Architecture Explorer',
          icon: 'Layers',
          items: [
            'Interactive SVG architecture diagrams for 9 projects',
            'Request flow simulation — watch data move through the system',
            'Side-by-side architecture comparison mode',
            'AI-powered architecture explanation via OpenAI',
            'Three zoom levels: Overview, Service Breakdown, Detail',
          ],
        },
        {
          category: 'Database Schema Explorer',
          icon: 'Database',
          items: [
            'Draggable ER diagrams for all 9 projects',
            'PK / FK / UQ / IDX badge system per column',
            'Live relationship edges that redraw as you drag tables',
            'Click-to-inspect detail panel with full column metadata',
            'Smart 4-side edge routing with cardinality markers',
            'Zoom controls with viewBox-based scaling',
          ],
        },
        {
          category: 'AI Assistant',
          icon: 'Zap',
          items: [
            'Context-aware AI chat powered by OpenAI GPT-4o',
            'Knows the full project portfolio and tech stack',
            'Explains architecture decisions on demand',
            'Answers technical questions about any project',
            'Streaming responses with typing animation',
          ],
        },
        {
          category: 'Live Data & Interactivity',
          icon: 'Activity',
          items: [
            'GitHub API integration — live repo stats and contributions',
            'Skills network graph with hover-to-explore connections',
            'Command palette (⌘K) for instant navigation',
            'Visitor counter via serverless API route',
            'Animated page transitions and scroll reveals',
          ],
        },
      ],
      challenges: [
        {
          title: 'Draggable SVG tables with live edge redraw',
          description: 'SVG pointer events, CSS transforms, and coordinate systems interact in non-obvious ways — getScreenCTM breaks under CSS scale transforms',
          solution: 'Dropped CSS transform entirely. Used getBoundingClientRect ratio (VW / rect.width) for coordinate conversion. Attached pointermove/up to window so drag never gets stuck. Delta-based position updates via functional setState to avoid stale closures.',
        },
        {
          title: 'Data-driven architecture without a CMS',
          description: 'All 9 projects needed rich, structured data for architecture diagrams, DB schemas, and case studies without a backend',
          solution: 'Designed a typed TypeScript data layer with separate files for projects, architectures, and DB schemas. Each schema is a strongly-typed object — the UI is purely a renderer.',
        },
      ],
      challengesExtended: [
        {
          title: 'SVG text overflow and badge misalignment',
          description: 'SVG text elements do not support CSS overflow:hidden or flexbox. Badge pills rendered at wrong positions when using mutable variables inside JSX render.',
          solution: 'Pre-computed all badge x-positions imperatively before JSX using a for-loop. Added SVG clipPath per row to hard-clip any overflow. Used fixed layout zones (NUM_X, BADGE_X, NAME_X, TYPE_X) as constants — no dynamic calculation in render.',
        },
        {
          title: 'AI context window management',
          description: 'The AI assistant needed full portfolio context without exceeding token limits on every message.',
          solution: 'Built a structured context object containing all project summaries, tech stacks, and architecture descriptions. Injected as a system prompt — the model has full context without the user needing to explain anything.',
        },
        {
          title: 'Performance with 9 animated SVG diagrams',
          description: 'Rendering 9 complex SVG diagrams with Framer Motion animations simultaneously caused layout thrashing.',
          solution: 'Used Next.js dynamic() with ssr:false to lazy-load each diagram engine. AnimatePresence with mode=wait ensures only one diagram animates at a time. Framer Motion animate only opacity — no layout-triggering properties.',
        },
      ],
      designDecisions: [
        'App Router over Pages Router — React Server Components reduce JS bundle for static sections',
        'SVG over Canvas for diagrams — SVG is accessible, animatable with Framer Motion, and scales perfectly',
        'TypeScript data layer over a CMS — zero latency, full type safety, no API calls for content',
        'Tailwind over CSS-in-JS — no runtime style injection, better performance, consistent design tokens',
        'OpenAI streaming API — perceived response time is near-instant even for long explanations',
      ],
      performanceNotes: [
        'Lazy-loaded all diagram engines with next/dynamic — initial bundle excludes heavy SVG components',
        'Framer Motion animations use transform and opacity only — GPU-composited, no layout recalculation',
        'GitHub API responses cached at the edge via Next.js route handlers with revalidate',
        'TailwindCSS purges unused styles at build time — CSS bundle under 15KB',
        'All images use next/image with WebP format and lazy loading',
      ],
      securityNotes: [
        'OpenAI API key stored in environment variables, never exposed to the client',
        'Contact form validated server-side in the API route before sending',
        'GitHub token scoped to read-only public repo access',
        'No user data stored — visitor counter uses anonymous IP hashing',
      ],
      edgeCases: [
        'AI assistant gracefully falls back to static summary if OpenAI API is unavailable',
        'GitHub section shows skeleton UI if API rate limit is hit',
        'DB diagram resets table positions when switching projects to avoid stale layout',
        'Architecture flow simulation cleans up all setTimeout refs on unmount to prevent memory leaks',
      ],
      learnings: [
        'SVG coordinate systems are completely separate from CSS layout — never mix CSS transforms with SVG matrix operations',
        'Data-driven UI is dramatically easier to maintain than hardcoded components — adding a new project is one data file change',
        'Framer Motion AnimatePresence requires stable keys — using project ID as key prevents ghost animations',
        'OpenAI streaming requires careful handling of partial JSON chunks in the response stream',
      ],
      futureImprovements: [
        'Add a blog section with MDX-powered technical articles',
        'Implement a project timeline view showing the engineering journey chronologically',
        'Add WebGL-based 3D skill visualization as an alternative to the SVG graph',
        'Integrate real-time collaboration — let visitors leave comments on architecture nodes',
      ],
      results: [
        { metric: 'Projects showcased',  value: '9',      description: 'With full case studies and architecture diagrams' },
        { metric: 'DB schemas',          value: '9',      description: 'Draggable ER diagrams with live edge routing' },
        { metric: 'Architecture levels', value: '2–3',    description: 'Overview + Service Breakdown per project' },
        { metric: 'AI context',          value: 'Full',   description: 'GPT-4o knows every project in the portfolio' },
        { metric: 'Bundle size',         value: '<90KB',  description: 'First Load JS shared chunks' },
        { metric: 'TypeScript',          value: '100%',   description: 'Zero any, zero ts-ignore' },
      ],
      codeSnippets: [
        {
          title: 'Drag coordinate conversion — SVG viewBox ratio',
          language: 'typescript',
          code: `const onMove = (ev: PointerEvent) => {
  if (!drag.current || !svgRef.current) return
  const rect = svgRef.current.getBoundingClientRect()
  // SVG units per CSS pixel — works regardless of zoom or container size
  const ratioX = VW / rect.width
  const ratioY = VH / rect.height
  const dxSVG = (ev.clientX - drag.current.lastClientX) * ratioX
  const dySVG = (ev.clientY - drag.current.lastClientY) * ratioY
  drag.current.lastClientX = ev.clientX
  drag.current.lastClientY = ev.clientY
  setPositions((prev) => {
    const cur = prev[drag.current!.id]
    return {
      ...prev,
      [drag.current!.id]: {
        x: Math.max(0, Math.min(VW - TABLE_W, cur.x + dxSVG)),
        y: Math.max(0, Math.min(VH - 50,     cur.y + dySVG)),
      },
    }
  })
}`,
          description: 'Delta-based drag using getBoundingClientRect ratio — avoids getScreenCTM which breaks under CSS transforms',
        },
        {
          title: 'Pre-computed badge layout — no mutable vars in JSX',
          language: 'typescript',
          code: `// Compute pill positions imperatively before JSX
const pills: { label: string; color: string; x: number }[] = []
let bx = BADGE_X
for (const b of shown) {
  pills.push({ ...b, x: bx })
  bx += pillW(b.label) + 3
}
// Then render — positions are stable, no mutation during render
return (
  <g>
    {pills.map((p) => (
      <Pill key={p.label} label={p.label} color={p.color} x={p.x} />
    ))}
  </g>
)`,
          description: 'Pre-computing layout positions before JSX prevents React render-order bugs with mutable variables',
        },
      ],
    },
  },
]
