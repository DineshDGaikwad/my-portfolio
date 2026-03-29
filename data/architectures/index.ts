import { ArchitectureDiagram } from './types'

export const architectures: ArchitectureDiagram[] = [
  // ─── Tesla Academy ────────────────────────────────────────────────────────
  {
    projectId: '1',
    projectSlug: 'tesla-academy',
    projectTitle: 'Tesla Academy',
    summary: 'Full-stack e-learning platform with role-based auth, REST API, and cloud media storage.',
    aiContext: `Tesla Academy is a full-stack e-learning platform. The frontend is a React SPA with TailwindCSS. The backend is a Python FastAPI service with 20+ REST endpoints. MongoDB Atlas stores users, courses, and progress. AWS S3 stores course media with pre-signed URLs. JWT-based role auth separates admin and student access. The system is deployed on cloud with a CI/CD pipeline.`,
    flowSteps: [
      { nodeId: 'client', label: 'User opens dashboard', duration: 800 },
      { nodeId: 'auth', label: 'JWT token validated', duration: 600 },
      { nodeId: 'api', label: 'Course data fetched', duration: 700 },
      { nodeId: 'db', label: 'MongoDB query executed', duration: 500 },
      { nodeId: 'api', label: 'Response serialized', duration: 400 },
      { nodeId: 'client', label: 'Dashboard rendered', duration: 600 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'High-level view of all major system components',
        nodes: [
          {
            id: 'client', label: 'React Client', sublabel: 'TailwindCSS + Framer',
            type: 'client', color: '#61dafb', x: 50, y: 10,
            details: {
              title: 'React Frontend',
              description: 'SPA with role-based routing. Admin and student dashboards rendered conditionally based on JWT claims.',
              tech: ['ReactJS', 'TailwindCSS', 'React Router', 'Axios'],
              role: 'Presentation layer — handles all UI, routing, and API communication',
            },
          },
          {
            id: 'auth', label: 'Auth Service', sublabel: 'JWT + Roles',
            type: 'auth', color: '#00d4ff', x: 15, y: 45,
            details: {
              title: 'Authentication Layer',
              description: 'JWT-based auth with role claims (admin/student). Tokens validated on every protected route.',
              tech: ['FastAPI', 'PyJWT', 'bcrypt', 'OAuth2'],
              role: 'Security boundary — issues and validates all access tokens',
              decisions: ['Chose JWT over sessions for stateless horizontal scaling'],
            },
          },
          {
            id: 'api', label: 'FastAPI Backend', sublabel: '20+ REST endpoints',
            type: 'api', color: '#009688', x: 50, y: 45,
            details: {
              title: 'FastAPI REST API',
              description: 'Async Python backend. Handles course CRUD, user management, progress tracking, and media upload orchestration.',
              tech: ['Python', 'FastAPI', 'Pydantic', 'Motor'],
              role: 'Business logic layer — all data operations flow through here',
              decisions: ['FastAPI chosen for async support and automatic OpenAPI docs'],
            },
          },
          {
            id: 's3', label: 'AWS S3', sublabel: 'Media Storage',
            type: 'storage', color: '#ff9900', x: 85, y: 45,
            details: {
              title: 'AWS S3 Storage',
              description: 'Course videos stored in S3. Pre-signed URLs allow direct browser uploads without proxying through the API.',
              tech: ['AWS S3', 'Pre-signed URLs', 'boto3', 'CloudFront'],
              role: 'Media storage — decoupled from API to avoid bandwidth bottleneck',
              decisions: ['Pre-signed URLs eliminate API as upload proxy, reducing latency by ~60%'],
            },
          },
          {
            id: 'db', label: 'MongoDB Atlas', sublabel: 'Document Store',
            type: 'database', color: '#47a248', x: 50, y: 80,
            details: {
              title: 'MongoDB Atlas',
              description: 'NoSQL document DB storing users, courses, enrollments, and progress. Collections optimized for dashboard read patterns.',
              tech: ['MongoDB', 'Motor', 'Aggregation Pipeline', 'Indexes'],
              role: 'Persistence layer — all application state stored here',
              decisions: ['MongoDB chosen over SQL for flexible course content schema'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'client', to: 'auth', label: 'Login/Register', style: 'solid' },
          { id: 'e2', from: 'client', to: 'api', label: 'API calls', style: 'solid' },
          { id: 'e3', from: 'client', to: 's3', label: 'Direct upload', style: 'dashed' },
          { id: 'e4', from: 'auth', to: 'api', label: 'Token validation', style: 'dashed' },
          { id: 'e5', from: 'api', to: 'db', label: 'Read/Write', style: 'solid' },
          { id: 'e6', from: 'api', to: 's3', label: 'Pre-signed URL', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Internal API service modules and their responsibilities',
        nodes: [
          {
            id: 'router', label: 'URL Router', sublabel: 'FastAPI routes',
            type: 'api', color: '#009688', x: 50, y: 10,
            details: {
              title: 'URL Router',
              description: 'FastAPI router maps HTTP methods and paths to handler functions. Middleware applied at router level.',
              tech: ['FastAPI Router', 'Middleware', 'Dependency Injection'],
              role: 'Entry point for all API requests',
            },
          },
          {
            id: 'auth_svc', label: 'Auth Module', sublabel: 'JWT + bcrypt',
            type: 'auth', color: '#00d4ff', x: 15, y: 45,
            details: {
              title: 'Auth Module',
              description: 'Handles user registration, login, token issuance, and role-based access control via FastAPI dependencies.',
              tech: ['PyJWT', 'bcrypt', 'FastAPI Depends'],
              role: 'Security — all protected routes depend on this module',
            },
          },
          {
            id: 'course_svc', label: 'Course Service', sublabel: 'CRUD + enrollment',
            type: 'service', color: '#7c3aed', x: 50, y: 45,
            details: {
              title: 'Course Service',
              description: 'Manages course creation, updates, enrollment, and progress tracking. Validates admin permissions before mutations.',
              tech: ['Motor', 'Pydantic', 'MongoDB Aggregation'],
              role: 'Core business logic for the learning platform',
            },
          },
          {
            id: 'media_svc', label: 'Media Service', sublabel: 'S3 pre-signed URLs',
            type: 'storage', color: '#ff9900', x: 85, y: 45,
            details: {
              title: 'Media Service',
              description: 'Generates pre-signed S3 URLs for secure direct uploads. Validates file type and size before issuing URL.',
              tech: ['boto3', 'AWS S3', 'File validation'],
              role: 'Decouples media handling from core API',
            },
          },
          {
            id: 'db_layer', label: 'Data Layer', sublabel: 'Motor async driver',
            type: 'database', color: '#47a248', x: 50, y: 80,
            details: {
              title: 'Async Data Layer',
              description: 'Motor (async MongoDB driver) with repository pattern. All DB operations are async to avoid blocking the event loop.',
              tech: ['Motor', 'MongoDB', 'Repository Pattern'],
              role: 'Data access abstraction — services never query DB directly',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'router', to: 'auth_svc', label: 'Auth check', style: 'dashed' },
          { id: 'e2', from: 'router', to: 'course_svc', label: 'Course ops', style: 'solid' },
          { id: 'e3', from: 'router', to: 'media_svc', label: 'Upload URL', style: 'solid' },
          { id: 'e4', from: 'course_svc', to: 'db_layer', label: 'Query', style: 'solid' },
          { id: 'e5', from: 'auth_svc', to: 'db_layer', label: 'User lookup', style: 'solid' },
        ],
      },
    ],
  },

  // ─── FitClub ──────────────────────────────────────────────────────────────
  {
    projectId: '2',
    projectSlug: 'fitclub',
    projectTitle: 'FitClub',
    summary: 'React SPA with role-based dashboards, EmailJS contact, and Cloudflare Pages deployment.',
    aiContext: `FitClub is a fitness management SPA built with React. It has separate admin and user dashboards using React Router protected routes. EmailJS handles contact form submissions without a backend. The app is deployed on Cloudflare Pages. No traditional backend — all state is client-side.`,
    flowSteps: [
      { nodeId: 'browser', label: 'User visits site', duration: 600 },
      { nodeId: 'router', label: 'Route matched', duration: 400 },
      { nodeId: 'auth_guard', label: 'Role checked', duration: 500 },
      { nodeId: 'dashboard', label: 'Dashboard rendered', duration: 700 },
      { nodeId: 'emailjs', label: 'Contact form sent', duration: 800 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Frontend-only architecture with external email service',
        nodes: [
          {
            id: 'browser', label: 'Browser / CDN', sublabel: 'Cloudflare Pages',
            type: 'client', color: '#f38020', x: 50, y: 10,
            details: {
              title: 'Cloudflare Pages Deployment',
              description: 'Static React build served from Cloudflare CDN. Global edge network ensures fast load times worldwide.',
              tech: ['Cloudflare Pages', 'CDN', 'Static Assets'],
              role: 'Hosting and delivery — no server required',
            },
          },
          {
            id: 'router', label: 'React Router', sublabel: 'Client-side routing',
            type: 'ui', color: '#61dafb', x: 50, y: 40,
            details: {
              title: 'React Router v6',
              description: 'Client-side routing with protected routes. Role-based guards redirect unauthorized users.',
              tech: ['React Router v6', 'Protected Routes', 'useNavigate'],
              role: 'Navigation layer — controls which views are accessible',
            },
          },
          {
            id: 'auth_guard', label: 'Auth Guard', sublabel: 'Role-based access',
            type: 'auth', color: '#00d4ff', x: 20, y: 65,
            details: {
              title: 'Client-side Auth Guard',
              description: 'Role stored in localStorage/context. Guards check role before rendering admin or user views.',
              tech: ['React Context', 'localStorage', 'HOC Pattern'],
              role: 'Access control — separates admin and user experiences',
              decisions: ['Client-side only auth acceptable since no sensitive server data'],
            },
          },
          {
            id: 'dashboard', label: 'Dashboards', sublabel: 'Admin + User views',
            type: 'ui', color: '#7c3aed', x: 80, y: 65,
            details: {
              title: 'Dual Dashboard System',
              description: 'Admin dashboard manages workout programs and users. User dashboard shows personalized plans and progress.',
              tech: ['React Components', 'CSS Modules', 'State Management'],
              role: 'Core UI — the primary user experience',
            },
          },
          {
            id: 'emailjs', label: 'EmailJS', sublabel: 'Backend-free email',
            type: 'external', color: '#ff6b35', x: 50, y: 88,
            details: {
              title: 'EmailJS Integration',
              description: 'Contact form sends emails directly from browser using EmailJS SDK. No backend server needed.',
              tech: ['EmailJS SDK', 'Email Templates', 'Service ID'],
              role: 'Communication — enables contact without a backend',
              decisions: ['EmailJS eliminates need for a Node.js server just for email'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'browser', to: 'router', label: 'Load app', style: 'solid' },
          { id: 'e2', from: 'router', to: 'auth_guard', label: 'Check role', style: 'dashed' },
          { id: 'e3', from: 'router', to: 'dashboard', label: 'Render view', style: 'solid' },
          { id: 'e4', from: 'auth_guard', to: 'dashboard', label: 'Authorize', style: 'dashed' },
          { id: 'e5', from: 'dashboard', to: 'emailjs', label: 'Send email', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Client-side module responsibilities and data flow',
        nodes: [
          { id: 'route_guard', label: 'Route Guard', sublabel: 'PrivateRoute HOC', type: 'auth', color: '#00d4ff', x: 50, y: 10,
            details: { title: 'Route Guard HOC', description: 'Higher-order component wraps protected routes. Reads role from context and redirects unauthorized users to login.', tech: ['React HOC', 'useContext', 'React Router'], role: 'Access control — enforces role-based navigation' } },
          { id: 'auth_ctx', label: 'Auth Context', sublabel: 'Role + session', type: 'auth', color: '#61dafb', x: 15, y: 45,
            details: { title: 'Auth Context Provider', description: 'React Context stores current user role and session state. Persisted to localStorage for page refresh survival.', tech: ['React Context', 'localStorage', 'useReducer'], role: 'State management — single source of auth truth' } },
          { id: 'admin_mod', label: 'Admin Module', sublabel: 'Program management', type: 'ui', color: '#7c3aed', x: 50, y: 45,
            details: { title: 'Admin Dashboard Module', description: 'Manages workout programs, user lists, and content. Only rendered when role === admin.', tech: ['React Components', 'useState', 'Props'], role: 'Admin UI — content and user management' } },
          { id: 'user_mod', label: 'User Module', sublabel: 'Plans + progress', type: 'ui', color: '#00ff88', x: 85, y: 45,
            details: { title: 'User Dashboard Module', description: 'Displays personalized workout plans and progress tracking. Reads from shared state populated on login.', tech: ['React Components', 'useEffect', 'Axios'], role: 'User UI — personalized fitness experience' } },
          { id: 'email_mod', label: 'Email Module', sublabel: 'EmailJS SDK', type: 'external', color: '#ff6b35', x: 50, y: 80,
            details: { title: 'EmailJS Module', description: 'Wraps EmailJS SDK. Validates form data, maps to template variables, and calls emailjs.send(). Handles success/error states.', tech: ['EmailJS SDK', 'Form Validation', 'Template Mapping'], role: 'Communication — backend-free email delivery' } },
        ],
        edges: [
          { id: 'e1', from: 'route_guard', to: 'auth_ctx', label: 'Read role', style: 'dashed' },
          { id: 'e2', from: 'route_guard', to: 'admin_mod', label: 'Admin access', style: 'solid' },
          { id: 'e3', from: 'route_guard', to: 'user_mod', label: 'User access', style: 'solid' },
          { id: 'e4', from: 'user_mod', to: 'email_mod', label: 'Contact form', style: 'dashed' },
        ],
      },
    ],
  },

  // ─── CVFS ─────────────────────────────────────────────────────────────────
  {
    projectId: '3',
    projectSlug: 'cvfs',
    projectTitle: 'Customized Virtual File System',
    summary: 'In-memory virtual file system in C++ using STL, OOP, and Unix-style permission bitmasks.',
    aiContext: `CVFS is a console-based virtual file system built in C++. It uses an STL unordered_map as an inode table. The command parser reads user input and dispatches to the FileSystemManager. File permissions use Unix-style bitmask flags. No disk I/O — everything is in-memory.`,
    flowSteps: [
      { nodeId: 'console', label: 'User enters command', duration: 600 },
      { nodeId: 'parser', label: 'Command parsed', duration: 400 },
      { nodeId: 'fs_manager', label: 'Operation dispatched', duration: 500 },
      { nodeId: 'inode', label: 'Inode table updated', duration: 600 },
      { nodeId: 'memory', label: 'Memory allocated', duration: 400 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Console-based virtual file system architecture',
        nodes: [
          {
            id: 'console', label: 'Console Interface', sublabel: 'stdin/stdout',
            type: 'client', color: '#00ff88', x: 50, y: 10,
            details: {
              title: 'Console Interface',
              description: 'Reads commands from stdin, displays results to stdout. Supports commands: create, read, write, delete, ls, chmod.',
              tech: ['C++ iostream', 'stdin/stdout', 'Command parsing'],
              role: 'User interface — the only interaction point',
            },
          },
          {
            id: 'parser', label: 'Command Parser', sublabel: 'Tokenizer + dispatcher',
            type: 'service', color: '#00d4ff', x: 50, y: 38,
            details: {
              title: 'Command Parser',
              description: 'Tokenizes input string, validates command syntax, and dispatches to the appropriate FileSystemManager method.',
              tech: ['C++ stringstream', 'Token parsing', 'Error handling'],
              role: 'Input processing — translates text commands to method calls',
            },
          },
          {
            id: 'fs_manager', label: 'FS Manager', sublabel: 'Core operations',
            type: 'system', color: '#7c3aed', x: 50, y: 62,
            details: {
              title: 'FileSystemManager',
              description: 'Core class implementing all file operations. Enforces permission checks before every read/write. Uses OOP inheritance for file vs directory types.',
              tech: ['C++ Classes', 'OOP', 'Encapsulation', 'Polymorphism'],
              role: 'Business logic — all file system rules enforced here',
              decisions: ['Strategy pattern used for different file type behaviors'],
            },
          },
          {
            id: 'inode', label: 'Inode Table', sublabel: 'STL unordered_map',
            type: 'database', color: '#f89820', x: 25, y: 85,
            details: {
              title: 'Inode Table',
              description: 'STL unordered_map<string, Inode> stores all file metadata. O(1) average lookup. Inode contains name, content, permissions bitmask, size, timestamps.',
              tech: ['STL unordered_map', 'Inode struct', 'Hash table'],
              role: 'Data store — in-memory equivalent of a disk inode table',
            },
          },
          {
            id: 'memory', label: 'Memory Pool', sublabel: 'Custom allocator',
            type: 'system', color: '#dc3545', x: 75, y: 85,
            details: {
              title: 'Memory Allocator',
              description: 'Custom memory pool simulates block-level storage allocation. Tracks used/free blocks to simulate realistic file system behavior.',
              tech: ['C++ new/delete', 'Memory pool', 'Block simulation'],
              role: 'Resource management — simulates disk block allocation',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'console', to: 'parser', label: 'Raw input', style: 'solid' },
          { id: 'e2', from: 'parser', to: 'fs_manager', label: 'Dispatch', style: 'solid' },
          { id: 'e3', from: 'fs_manager', to: 'inode', label: 'Metadata ops', style: 'solid' },
          { id: 'e4', from: 'fs_manager', to: 'memory', label: 'Allocate', style: 'solid' },
          { id: 'e5', from: 'fs_manager', to: 'console', label: 'Output result', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Internal C++ class responsibilities and method dispatch',
        nodes: [
          { id: 'cmd_handler', label: 'Command Handler', sublabel: 'Dispatch table', type: 'service', color: '#00d4ff', x: 50, y: 10,
            details: { title: 'Command Handler', description: 'Maps command strings to FileSystemManager methods using a dispatch table (unordered_map of function pointers). O(1) command lookup.', tech: ['C++ unordered_map', 'Function Pointers', 'Dispatch Table'], role: 'Routing — maps text commands to method calls' } },
          { id: 'perm_engine', label: 'Permission Engine', sublabel: 'Bitmask checks', type: 'auth', color: '#ff0080', x: 15, y: 45,
            details: { title: 'Permission Engine', description: 'Unix-style bitmask permission checks (read=4, write=2, execute=1). Validates user permissions before every file operation.', tech: ['Bitmask Operations', 'C++ Bitwise', 'Unix Permissions'], role: 'Security — enforces file access control' } },
          { id: 'file_ops', label: 'File Operations', sublabel: 'CRUD + metadata', type: 'system', color: '#7c3aed', x: 50, y: 45,
            details: { title: 'File Operations Module', description: 'Implements create, read, write, delete, and list operations. Updates inode metadata (size, timestamps) on every mutation.', tech: ['C++ Classes', 'OOP', 'Inode Struct'], role: 'Core logic — all file system operations' } },
          { id: 'dir_ops', label: 'Directory Ops', sublabel: 'Tree traversal', type: 'system', color: '#00ff88', x: 85, y: 45,
            details: { title: 'Directory Operations', description: 'Manages directory tree using recursive traversal. Supports nested paths and relative/absolute path resolution.', tech: ['Recursive Traversal', 'Path Resolution', 'C++ Recursion'], role: 'Navigation — directory tree management' } },
          { id: 'mem_mgr', label: 'Memory Manager', sublabel: 'Block allocator', type: 'system', color: '#dc3545', x: 50, y: 80,
            details: { title: 'Memory Manager', description: 'Custom block allocator simulates disk block allocation. Tracks free/used blocks with a bitmap. Reclaims blocks on file deletion.', tech: ['Custom Allocator', 'Bitmap Tracking', 'C++ new/delete'], role: 'Resource management — simulates disk storage' } },
        ],
        edges: [
          { id: 'e1', from: 'cmd_handler', to: 'perm_engine', label: 'Check perms', style: 'dashed' },
          { id: 'e2', from: 'cmd_handler', to: 'file_ops', label: 'File op', style: 'solid' },
          { id: 'e3', from: 'cmd_handler', to: 'dir_ops', label: 'Dir op', style: 'solid' },
          { id: 'e4', from: 'file_ops', to: 'mem_mgr', label: 'Allocate', style: 'solid' },
          { id: 'e5', from: 'dir_ops', to: 'mem_mgr', label: 'Allocate', style: 'solid' },
        ],
      },
    ],
  },

  // ─── Transport System ─────────────────────────────────────────────────────
  {
    projectId: '4',
    projectSlug: 'transport-system',
    projectTitle: 'Transport Management System',
    summary: 'Django MVC application with SQL database, admin/user interfaces, and ORM-based data access.',
    aiContext: `The Transport Management System is a Django MVC web application. Django Views handle HTTP requests and render HTML templates. The ORM maps Python models to SQL tables. Separate admin and user interfaces control access. The database stores drivers, vehicles, routes, and assignments with normalized relational schema.`,
    flowSteps: [
      { nodeId: 'browser', label: 'HTTP request received', duration: 500 },
      { nodeId: 'urls', label: 'URL pattern matched', duration: 400 },
      { nodeId: 'views', label: 'View function called', duration: 600 },
      { nodeId: 'orm', label: 'ORM query executed', duration: 700 },
      { nodeId: 'db', label: 'SQL query runs', duration: 500 },
      { nodeId: 'templates', label: 'HTML template rendered', duration: 400 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Django MVC architecture with relational database',
        nodes: [
          {
            id: 'browser', label: 'Browser', sublabel: 'HTML/CSS/JS',
            type: 'client', color: '#e34f26', x: 50, y: 8,
            details: {
              title: 'Browser Client',
              description: 'Standard web browser rendering Django-served HTML templates. JavaScript handles form interactions and basic UI.',
              tech: ['HTML5', 'CSS3', 'JavaScript', 'Django Templates'],
              role: 'Presentation — server-rendered HTML pages',
            },
          },
          {
            id: 'urls', label: 'URL Router', sublabel: 'urls.py',
            type: 'api', color: '#092e20', x: 50, y: 30,
            details: {
              title: 'Django URL Router',
              description: 'urls.py maps URL patterns to view functions using regex or path converters. Separate URL configs for admin and user sections.',
              tech: ['Django URLs', 'path()', 'include()', 'URL namespaces'],
              role: 'Routing — maps HTTP paths to handler functions',
            },
          },
          {
            id: 'views', label: 'Views Layer', sublabel: 'Business logic',
            type: 'service', color: '#3776ab', x: 50, y: 52,
            details: {
              title: 'Django Views',
              description: 'Function-based and class-based views handle request processing, permission checking, and response generation.',
              tech: ['Django Views', 'CBV', 'FBV', 'Decorators', 'Mixins'],
              role: 'Controller — processes requests and coordinates data access',
            },
          },
          {
            id: 'orm', label: 'Django ORM', sublabel: 'Model layer',
            type: 'service', color: '#44b78b', x: 25, y: 75,
            details: {
              title: 'Django ORM',
              description: 'Python model classes map to SQL tables. QuerySets provide lazy evaluation and query optimization. Migrations manage schema changes.',
              tech: ['Django Models', 'QuerySet API', 'Migrations', 'Signals'],
              role: 'Data access — abstracts SQL behind Python objects',
            },
          },
          {
            id: 'templates', label: 'Templates', sublabel: 'Jinja2 / DTL',
            type: 'ui', color: '#f7df1e', x: 75, y: 75,
            details: {
              title: 'Django Template Engine',
              description: 'Django Template Language renders dynamic HTML. Template inheritance reduces duplication. Context processors inject global data.',
              tech: ['Django Templates', 'Template Tags', 'Filters', 'Inheritance'],
              role: 'View rendering — generates final HTML sent to browser',
            },
          },
          {
            id: 'db', label: 'SQL Database', sublabel: 'Normalized schema',
            type: 'database', color: '#336791', x: 50, y: 92,
            details: {
              title: 'Relational Database',
              description: 'Normalized SQL schema with tables for drivers, vehicles, routes, and assignments. Foreign keys enforce referential integrity.',
              tech: ['SQL', 'Django ORM', 'Migrations', 'Indexes'],
              role: 'Persistence — all application data stored relationally',
              decisions: ['SQL chosen for complex many-to-many relationships between drivers, vehicles, and routes'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'browser', to: 'urls', label: 'HTTP request', style: 'solid' },
          { id: 'e2', from: 'urls', to: 'views', label: 'Dispatch', style: 'solid' },
          { id: 'e3', from: 'views', to: 'orm', label: 'Query data', style: 'solid' },
          { id: 'e4', from: 'views', to: 'templates', label: 'Render', style: 'solid' },
          { id: 'e5', from: 'orm', to: 'db', label: 'SQL query', style: 'solid' },
          { id: 'e6', from: 'templates', to: 'browser', label: 'HTML response', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Django app modules and their internal responsibilities',
        nodes: [
          { id: 'middleware', label: 'Middleware Stack', sublabel: 'Auth + CSRF', type: 'auth', color: '#00d4ff', x: 50, y: 10,
            details: { title: 'Django Middleware', description: 'Authentication, CSRF protection, and session middleware applied to every request before reaching views.', tech: ['Django Middleware', 'CSRF', 'SessionMiddleware'], role: 'Security — request pre-processing pipeline' } },
          { id: 'driver_svc', label: 'Driver Module', sublabel: 'CRUD + assignment', type: 'service', color: '#3776ab', x: 15, y: 45,
            details: { title: 'Driver Management Module', description: 'Handles driver registration, profile updates, and route assignments. Validates license and availability before assignment.', tech: ['Django Views', 'Django ORM', 'Forms'], role: 'Domain logic — driver lifecycle management' } },
          { id: 'vehicle_svc', label: 'Vehicle Module', sublabel: 'Fleet tracking', type: 'service', color: '#44b78b', x: 50, y: 45,
            details: { title: 'Vehicle Management Module', description: 'Manages vehicle registration, maintenance schedules, and availability status. Links vehicles to routes and drivers.', tech: ['Django Models', 'QuerySet', 'Admin Interface'], role: 'Fleet management — vehicle state and assignment' } },
          { id: 'route_svc', label: 'Route Module', sublabel: 'Schedule + stops', type: 'service', color: '#092e20', x: 85, y: 45,
            details: { title: 'Route Management Module', description: 'Defines routes with stops, schedules, and assigned vehicles. Many-to-many relationships managed via Django ORM.', tech: ['Django ORM', 'ManyToManyField', 'QuerySet'], role: 'Scheduling — route and timetable management' } },
          { id: 'admin_panel', label: 'Admin Panel', sublabel: 'Django Admin', type: 'ui', color: '#f7df1e', x: 50, y: 80,
            details: { title: 'Django Admin Interface', description: 'Auto-generated admin panel for superusers. Custom ModelAdmin classes add filters, search, and inline editing for transport data.', tech: ['Django Admin', 'ModelAdmin', 'Inline Models'], role: 'Management UI — superuser data control' } },
        ],
        edges: [
          { id: 'e1', from: 'middleware', to: 'driver_svc', label: 'Authenticated', style: 'dashed' },
          { id: 'e2', from: 'middleware', to: 'vehicle_svc', label: 'Authenticated', style: 'dashed' },
          { id: 'e3', from: 'middleware', to: 'route_svc', label: 'Authenticated', style: 'dashed' },
          { id: 'e4', from: 'driver_svc', to: 'route_svc', label: 'Assign driver', style: 'solid' },
          { id: 'e5', from: 'vehicle_svc', to: 'route_svc', label: 'Assign vehicle', style: 'solid' },
          { id: 'e6', from: 'admin_panel', to: 'driver_svc', label: 'Manage', style: 'dashed' },
        ],
      },
    ],
  },

  // ─── Car Rental System ────────────────────────────────────────────────────
  {
    projectId: '5',
    projectSlug: 'car-rental-system',
    projectTitle: 'Car Rental System',
    summary: 'Java OOP console application with Strategy pattern pricing and in-memory data management.',
    aiContext: `The Car Rental System is a Java console application. RentalManager orchestrates all operations. Car, Customer, and Rental are well-defined OOP classes. The Strategy pattern implements dynamic pricing per car category. All data is stored in-memory using Java collections. SOLID principles are applied throughout.`,
    flowSteps: [
      { nodeId: 'console', label: 'User selects action', duration: 500 },
      { nodeId: 'rental_mgr', label: 'RentalManager called', duration: 400 },
      { nodeId: 'pricing', label: 'Price calculated', duration: 600 },
      { nodeId: 'car', label: 'Car availability checked', duration: 400 },
      { nodeId: 'store', label: 'Rental record saved', duration: 500 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Java OOP architecture with Strategy pattern',
        nodes: [
          {
            id: 'console', label: 'Console UI', sublabel: 'Scanner input',
            type: 'client', color: '#f89820', x: 50, y: 8,
            details: {
              title: 'Console Interface',
              description: 'Java Scanner reads user input. Menu-driven interface presents options for renting, returning, and viewing history.',
              tech: ['Java Scanner', 'System.out', 'Menu system'],
              role: 'User interface — text-based interaction layer',
            },
          },
          {
            id: 'rental_mgr', label: 'RentalManager', sublabel: 'Orchestrator',
            type: 'service', color: '#00d4ff', x: 50, y: 35,
            details: {
              title: 'RentalManager',
              description: 'Central orchestrator class. Coordinates between Car, Customer, and Rental objects. Validates business rules before processing.',
              tech: ['Java Classes', 'OOP', 'Facade Pattern'],
              role: 'Business logic — single entry point for all rental operations',
              decisions: ['Facade pattern simplifies complex multi-object coordination'],
            },
          },
          {
            id: 'pricing', label: 'Pricing Engine', sublabel: 'Strategy pattern',
            type: 'service', color: '#7c3aed', x: 15, y: 62,
            details: {
              title: 'Pricing Strategy Engine',
              description: 'Strategy pattern with separate rate calculators per car category (Economy, Standard, Luxury). Easily extensible for new categories.',
              tech: ['Strategy Pattern', 'Interface', 'Polymorphism'],
              role: 'Pricing logic — decoupled from rental flow for easy extension',
              decisions: ['Strategy pattern allows adding new pricing models without modifying existing code (Open/Closed Principle)'],
            },
          },
          {
            id: 'car', label: 'Car Entity', sublabel: 'Availability + details',
            type: 'system', color: '#00ff88', x: 50, y: 62,
            details: {
              title: 'Car Entity Class',
              description: 'Encapsulates car properties (ID, model, category, availability). Availability flag updated atomically on rent/return.',
              tech: ['Java Class', 'Encapsulation', 'Getters/Setters'],
              role: 'Domain model — represents the core business entity',
            },
          },
          {
            id: 'customer', label: 'Customer Entity', sublabel: 'Profile + history',
            type: 'system', color: '#ff0080', x: 85, y: 62,
            details: {
              title: 'Customer Entity Class',
              description: 'Stores customer profile and rental history. Linked to Rental objects via customer ID.',
              tech: ['Java Class', 'ArrayList', 'Encapsulation'],
              role: 'Domain model — tracks who is renting what',
            },
          },
          {
            id: 'store', label: 'In-Memory Store', sublabel: 'Java Collections',
            type: 'database', color: '#336791', x: 50, y: 88,
            details: {
              title: 'In-Memory Data Store',
              description: 'Java ArrayList and HashMap store cars, customers, and rental records. Data persists for session duration only.',
              tech: ['ArrayList', 'HashMap', 'Java Collections'],
              role: 'Data persistence — session-scoped in-memory storage',
              decisions: ['In-memory chosen for simplicity; ready for JDBC/JPA integration'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'console', to: 'rental_mgr', label: 'User action', style: 'solid' },
          { id: 'e2', from: 'rental_mgr', to: 'pricing', label: 'Calculate price', style: 'solid' },
          { id: 'e3', from: 'rental_mgr', to: 'car', label: 'Check availability', style: 'solid' },
          { id: 'e4', from: 'rental_mgr', to: 'customer', label: 'Lookup customer', style: 'solid' },
          { id: 'e5', from: 'rental_mgr', to: 'store', label: 'Save rental', style: 'solid' },
          { id: 'e6', from: 'store', to: 'car', label: 'Update status', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Java class responsibilities and OOP design patterns',
        nodes: [
          { id: 'menu_svc', label: 'Menu Service', sublabel: 'Input handling', type: 'ui', color: '#f89820', x: 50, y: 10,
            details: { title: 'Menu Service', description: 'Renders menu options and reads user input via Scanner. Validates input range before dispatching to RentalManager.', tech: ['Java Scanner', 'Input Validation', 'Switch Statement'], role: 'UI layer — user interaction handling' } },
          { id: 'rental_svc', label: 'Rental Service', sublabel: 'Lifecycle ops', type: 'service', color: '#00d4ff', x: 50, y: 40,
            details: { title: 'Rental Service', description: 'Manages the full rental lifecycle: create, extend, return. Validates car availability and customer eligibility before processing.', tech: ['Java Classes', 'Business Rules', 'Validation'], role: 'Core logic — rental lifecycle orchestration' } },
          { id: 'pricing_svc', label: 'Pricing Service', sublabel: 'Strategy pattern', type: 'service', color: '#7c3aed', x: 15, y: 68,
            details: { title: 'Pricing Strategy Service', description: 'Interface-based pricing with Economy, Standard, and Luxury implementations. RentalManager injects the correct strategy at runtime.', tech: ['Strategy Pattern', 'Java Interface', 'Polymorphism'], role: 'Pricing — extensible rate calculation' } },
          { id: 'inventory_svc', label: 'Inventory Service', sublabel: 'Car availability', type: 'system', color: '#00ff88', x: 85, y: 68,
            details: { title: 'Inventory Service', description: 'Tracks car availability using a HashMap. Atomic availability flag updates prevent double-renting in single-threaded context.', tech: ['HashMap', 'Availability Flag', 'Java Collections'], role: 'Inventory — real-time car availability tracking' } },
          { id: 'history_svc', label: 'History Service', sublabel: 'Rental records', type: 'database', color: '#336791', x: 50, y: 88,
            details: { title: 'Rental History Service', description: 'Maintains per-customer rental history using ArrayList. Supports history retrieval and active rental lookup.', tech: ['ArrayList', 'HashMap', 'Java Collections'], role: 'Persistence — session-scoped rental records' } },
        ],
        edges: [
          { id: 'e1', from: 'menu_svc', to: 'rental_svc', label: 'Action', style: 'solid' },
          { id: 'e2', from: 'rental_svc', to: 'pricing_svc', label: 'Get rate', style: 'solid' },
          { id: 'e3', from: 'rental_svc', to: 'inventory_svc', label: 'Check/update', style: 'solid' },
          { id: 'e4', from: 'rental_svc', to: 'history_svc', label: 'Save record', style: 'solid' },
        ],
      },
    ],
  },


  // ─── BookNow ──────────────────────────────────────────────────────────────
  {
    projectId: '6',
    projectSlug: 'booknow',
    projectTitle: 'BookNow',
    summary: '.NET 8 BookMyShow-style booking platform — venue management, slot locking, waitlist, payment gateway, and real-time notifications.',
    aiContext: `BookNow is a full-stack appointment and event booking platform modelled after BookMyShow. The AngularJS frontend has a calendar UI with seat selection. The .NET 8 Web API uses Clean Architecture (Controller → Service → Repository). MS SQL Server stores venues, services, slots, bookings, payments, and waitlists. JWT auth carries role claims (Admin/Customer/Provider). SQL row-level locking inside transactions prevents double-booking. A notification service sends email/SMS confirmations asynchronously. A waitlist engine auto-promotes queued customers on cancellation.`,
    flowSteps: [
      { nodeId: 'angular',      label: 'User browses venues',        duration: 600 },
      { nodeId: 'api',          label: 'JWT validated',               duration: 400 },
      { nodeId: 'slot_svc',     label: 'Slot availability checked',   duration: 600 },
      { nodeId: 'lock_svc',     label: 'Row-level lock acquired',     duration: 500 },
      { nodeId: 'db',           label: 'Booking + payment saved',     duration: 700 },
      { nodeId: 'notify',       label: 'Confirmation sent async',     duration: 400 },
      { nodeId: 'angular',      label: 'Booking confirmed on UI',     duration: 500 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'BookMyShow-style platform — venue → service → slot → booking → payment → notification pipeline',
        nodes: [
          {
            id: 'angular', label: 'AngularJS SPA', sublabel: 'Calendar · Seat Map · Dashboards',
            type: 'client', color: '#dd0031', x: 50, y: 6,
            details: {
              title: 'AngularJS Frontend',
              description: 'Interactive calendar with seat-map UI. Role-specific dashboards for Admin (venue mgmt), Customer (bookings), and Provider (schedule mgmt). JWT decoded client-side to render correct view.',
              tech: ['AngularJS', 'HTML5', 'CSS3', 'JWT Decode', 'Calendar UI'],
              role: 'Presentation layer — role-aware booking interface',
              decisions: ['AngularJS chosen to match existing internship stack; same patterns as BookMyShow web'],
            },
          },
          {
            id: 'gateway', label: 'API Gateway', sublabel: 'Rate limit · CORS · JWT',
            type: 'auth', color: '#00d4ff', x: 50, y: 26,
            details: {
              title: 'ASP.NET Core Middleware Pipeline',
              description: 'JWT Bearer validation, CORS policy, rate limiting, and request logging applied before any controller executes. FluentValidation on all DTOs.',
              tech: ['ASP.NET Core Middleware', 'JWT Bearer', 'FluentValidation', 'Serilog'],
              role: 'Security & cross-cutting concerns — every request passes through here',
              decisions: ['Middleware pipeline keeps controllers thin and security centralised'],
            },
          },
          {
            id: 'api', label: '.NET 8 Web API', sublabel: 'Controllers · Swagger',
            type: 'api', color: '#512bd4', x: 20, y: 48,
            details: {
              title: '.NET 8 REST API',
              description: 'Thin controllers for Venues, Services, Slots, Bookings, Payments, Waitlist. Each delegates immediately to the Service layer. Swagger/OpenAPI auto-generated.',
              tech: ['.NET 8', 'ASP.NET Core', 'Swagger', 'AutoMapper', 'DTOs'],
              role: 'HTTP entry point — routes requests to business logic',
            },
          },
          {
            id: 'service_layer', label: 'Service Layer', sublabel: 'Business rules · Orchestration',
            type: 'service', color: '#7c3aed', x: 50, y: 48,
            details: {
              title: 'Clean Architecture Service Layer',
              description: 'BookingService orchestrates slot locking, conflict detection, waitlist promotion, and payment initiation. VenueService and SlotService handle availability logic.',
              tech: ['C# Services', 'Dependency Injection', 'IUnitOfWork', 'Async/Await'],
              role: 'Business logic — all booking rules enforced here',
              decisions: ['Service layer keeps controllers thin and logic fully unit-testable'],
            },
          },
          {
            id: 'notify', label: 'Notification Service', sublabel: 'Email · SMS · Async',
            type: 'external', color: '#ff9900', x: 80, y: 48,
            details: {
              title: 'Async Notification Service',
              description: 'Sends booking confirmations, cancellation alerts, and waitlist promotion notices via SMTP email and SMS gateway. Decoupled from booking flow — fires after DB commit.',
              tech: ['SMTP', 'Twilio SMS', 'Background Service', 'IHostedService'],
              role: 'Communication — async post-booking notifications',
              decisions: ['Async decoupling ensures booking API response is not blocked by email delivery'],
            },
          },
          {
            id: 'repo', label: 'Repository Layer', sublabel: 'EF Core · Unit of Work',
            type: 'service', color: '#44b78b', x: 35, y: 70,
            details: {
              title: 'Repository + Unit of Work Pattern',
              description: 'Generic and specific repositories abstract all EF Core queries. IUnitOfWork wraps transactions. Services never touch DbContext directly.',
              tech: ['EF Core 8', 'Repository Pattern', 'IUnitOfWork', 'LINQ'],
              role: 'Data access abstraction — decouples business logic from ORM',
            },
          },
          {
            id: 'db', label: 'MS SQL Server', sublabel: 'Row-lock · Transactions · Indexes',
            type: 'database', color: '#cc2927', x: 50, y: 90,
            details: {
              title: 'MS SQL Server — Transactional Core',
              description: 'Stores Users, Venues, Services, Slots, Bookings, Payments, Waitlist. Row-level locking (UPDLOCK hint) inside serializable transactions prevents double-booking. Non-clustered indexes on slot start_time and booking status.',
              tech: ['MS SQL Server', 'EF Core Migrations', 'UPDLOCK', 'Serializable Transactions', 'Non-clustered Indexes'],
              role: 'Persistence — atomic slot reservation enforced at DB level',
              decisions: ['UPDLOCK + serializable isolation guarantees zero double-bookings even at 1000 concurrent requests'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'angular',       to: 'gateway',       label: 'HTTPS + Bearer',    style: 'solid'  },
          { id: 'e2', from: 'gateway',       to: 'api',           label: 'Validated request', style: 'solid'  },
          { id: 'e3', from: 'api',           to: 'service_layer', label: 'Delegate',          style: 'solid'  },
          { id: 'e4', from: 'service_layer', to: 'notify',        label: 'Fire & forget',     style: 'dashed' },
          { id: 'e5', from: 'service_layer', to: 'repo',          label: 'Query / Persist',   style: 'solid'  },
          { id: 'e6', from: 'repo',          to: 'db',            label: 'EF Core SQL',       style: 'solid'  },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Internal service modules — slot locking, conflict detection, waitlist engine, payment flow',
        nodes: [
          {
            id: 'slot_svc', label: 'Slot Service', sublabel: 'Availability · Locking',
            type: 'service', color: '#512bd4', x: 50, y: 8,
            details: {
              title: 'Slot Availability Service',
              description: 'Queries available slots for a service on a given date. Applies UPDLOCK hint on the slot row before decrementing available_seats to prevent race conditions.',
              tech: ['EF Core', 'UPDLOCK Hint', 'Raw SQL', 'Async'],
              role: 'Availability engine — real-time seat count management',
              decisions: ['UPDLOCK chosen over application-level locking for DB-enforced atomicity'],
            },
          },
          {
            id: 'lock_svc', label: 'Conflict Detector', sublabel: 'Overlap · Row lock',
            type: 'service', color: '#ff0080', x: 15, y: 38,
            details: {
              title: 'Booking Conflict Detector',
              description: 'Stored procedure checks time-range overlaps for the same slot before any booking is committed. Returns conflict metadata if found. Runs inside the same transaction as the booking insert.',
              tech: ['SQL Stored Procedure', 'Interval Overlap Logic', 'Serializable Isolation'],
              role: 'Conflict prevention — zero double-bookings under concurrency',
            },
          },
          {
            id: 'booking_svc', label: 'Booking Service', sublabel: 'Lifecycle · Orchestrator',
            type: 'service', color: '#7c3aed', x: 50, y: 38,
            details: {
              title: 'Booking Orchestrator',
              description: 'Coordinates the full booking lifecycle: check slot → lock row → create booking → initiate payment → trigger notification. Rolls back on any failure.',
              tech: ['C# Service', 'EF Core Transactions', 'Async/Await', 'IUnitOfWork'],
              role: 'Core orchestrator — single entry point for all reservation operations',
            },
          },
          {
            id: 'payment_svc', label: 'Payment Service', sublabel: 'Razorpay · Stripe · UPI',
            type: 'external', color: '#ff9900', x: 85, y: 38,
            details: {
              title: 'Payment Gateway Service',
              description: 'Integrates Razorpay, Stripe, and UPI. Creates payment order, verifies webhook signature, updates payment status. Supports full and partial refunds on cancellation.',
              tech: ['Razorpay SDK', 'Stripe API', 'HMAC Webhook Verification', 'Idempotency Keys'],
              role: 'Payment processing — gateway-agnostic abstraction',
              decisions: ['Idempotency keys prevent duplicate charges on network retries'],
            },
          },
          {
            id: 'waitlist_svc', label: 'Waitlist Engine', sublabel: 'Queue · Auto-promote',
            type: 'service', color: '#00ff88', x: 15, y: 68,
            details: {
              title: 'Waitlist Promotion Engine',
              description: 'On booking cancellation, automatically promotes the next customer in the waitlist queue. Sends notification and creates a new booking with a 15-minute payment window.',
              tech: ['C# Background Service', 'Queue Logic', 'EF Core', 'SMTP/SMS'],
              role: 'Waitlist management — maximises slot utilisation on cancellations',
            },
          },
          {
            id: 'auth_svc', label: 'Auth Service', sublabel: 'JWT · Refresh · Roles',
            type: 'auth', color: '#00d4ff', x: 50, y: 68,
            details: {
              title: 'Authentication & Authorisation Service',
              description: 'Issues JWT access tokens (15 min) and refresh tokens (7 days). Role claims (Admin/Customer/Provider) embedded in token. Refresh token rotation on every use.',
              tech: ['JWT', 'BCrypt', 'Refresh Token Rotation', 'ASP.NET Core Identity'],
              role: 'Identity — issues, validates, and rotates all access tokens',
            },
          },
          {
            id: 'db_layer', label: 'Data Layer', sublabel: 'EF Core · Migrations',
            type: 'database', color: '#cc2927', x: 85, y: 68,
            details: {
              title: 'EF Core Data Access Layer',
              description: 'Repository pattern over EF Core 8. Compiled queries on hot paths (slot availability, booking lookup). Code-first migrations manage schema evolution.',
              tech: ['EF Core 8', 'Compiled Queries', 'Code-First Migrations', 'Connection Pooling'],
              role: 'Persistence abstraction — all DB access goes through repositories',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'booking_svc',  to: 'slot_svc',     label: 'Check seats',      style: 'solid'  },
          { id: 'e2', from: 'booking_svc',  to: 'lock_svc',     label: 'Detect conflict',  style: 'solid'  },
          { id: 'e3', from: 'booking_svc',  to: 'payment_svc',  label: 'Initiate payment', style: 'solid'  },
          { id: 'e4', from: 'booking_svc',  to: 'auth_svc',     label: 'Verify role',      style: 'dashed' },
          { id: 'e5', from: 'booking_svc',  to: 'db_layer',     label: 'Persist',          style: 'solid'  },
          { id: 'e6', from: 'waitlist_svc', to: 'booking_svc',  label: 'Auto-promote',     style: 'dashed' },
          { id: 'e7', from: 'lock_svc',     to: 'db_layer',     label: 'Lock query',       style: 'solid'  },
          { id: 'e8', from: 'slot_svc',     to: 'db_layer',     label: 'Seat count',       style: 'solid'  },
        ],
      },
    ],
  },

  // ─── Property Registry ────────────────────────────────────────────────────
  {
    projectId: '7',
    projectSlug: 'property-registry',
    projectTitle: 'Property Registry Portal',
    summary: '.NET 8 government-style registry with multi-step approval workflow, immutable audit trail, and fraud detection.',
    aiContext: `The Property Registry Portal is a .NET 8 Web API with AngularJS frontend. It manages property ownership records and transfers through a multi-step approval workflow (Citizen → Officer → Admin). A state machine enforces valid transitions. All state changes are written to an immutable audit log table. MS SQL Server stores properties, owners, transactions, and audit records. JWT auth with role-based access controls each approval stage.`,
    flowSteps: [
      { nodeId: 'angular', label: 'Citizen submits transfer', duration: 600 },
      { nodeId: 'workflow', label: 'State machine validates', duration: 700 },
      { nodeId: 'fraud', label: 'Duplicate check runs', duration: 600 },
      { nodeId: 'db', label: 'Record updated', duration: 500 },
      { nodeId: 'audit', label: 'Audit log written', duration: 400 },
      { nodeId: 'angular', label: 'Status updated', duration: 500 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Multi-step approval workflow with immutable audit trail',
        nodes: [
          {
            id: 'angular', label: 'AngularJS Portal', sublabel: 'Citizen / Officer / Admin',
            type: 'client', color: '#dd0031', x: 50, y: 8,
            details: {
              title: 'AngularJS Frontend',
              description: 'Role-specific views for Citizens (submit), Officers (review), and Admins (approve/reject). Each role sees only their workflow stage.',
              tech: ['AngularJS', 'Role-based Views', 'JWT Decode'],
              role: 'Presentation — three distinct role interfaces in one SPA',
            },
          },
          {
            id: 'api', label: '.NET 8 API', sublabel: 'REST endpoints',
            type: 'api', color: '#512bd4', x: 50, y: 35,
            details: {
              title: '.NET 8 Web API',
              description: 'Controllers for property CRUD, transfer initiation, and approval actions. JWT middleware enforces role access per endpoint.',
              tech: ['.NET 8', 'ASP.NET Core', 'JWT', 'Swagger'],
              role: 'API gateway — routes requests to workflow engine',
            },
          },
          {
            id: 'workflow', label: 'Workflow Engine', sublabel: 'State machine',
            type: 'service', color: '#7c3aed', x: 20, y: 60,
            details: {
              title: 'Approval Workflow Engine',
              description: 'State machine enforces valid transitions: Draft → Submitted → Officer Review → Admin Approval → Completed. Invalid transitions are rejected.',
              tech: ['State Machine Pattern', 'C# Enums', 'Transition Rules'],
              role: 'Business logic — governs the entire transfer lifecycle',
              decisions: ['State machine prevents illegal status jumps without code changes'],
            },
          },
          {
            id: 'fraud', label: 'Fraud Detector', sublabel: 'Duplicate check',
            type: 'service', color: '#ff0080', x: 80, y: 60,
            details: {
              title: 'Fraud Detection Service',
              description: 'Runs uniqueness checks on property identifiers before registration is accepted. Flags suspicious patterns for manual review.',
              tech: ['SQL Uniqueness Constraints', 'Pattern Matching', 'Flag System'],
              role: 'Integrity — prevents duplicate and fraudulent registrations',
            },
          },
          {
            id: 'db', label: 'MS SQL Server', sublabel: 'Property + Owner tables',
            type: 'database', color: '#cc2927', x: 35, y: 85,
            details: {
              title: 'MS SQL Server',
              description: 'Normalized schema: Properties, Owners, Transfers, Documents. Partitioned tables by year for historical query performance.',
              tech: ['MS SQL Server', 'EF Core', 'Partitioned Tables', 'Indexed Views'],
              role: 'Persistence — all property and ownership data',
            },
          },
          {
            id: 'audit', label: 'Audit Log', sublabel: 'Immutable trail',
            type: 'database', color: '#ff9900', x: 65, y: 85,
            details: {
              title: 'Immutable Audit Log',
              description: 'Append-only table records every state change with timestamp, actor, old state, and new state. No updates or deletes allowed.',
              tech: ['Append-only Table', 'SQL Triggers', 'Timestamps'],
              role: 'Compliance — full traceable history of every property change',
              decisions: ['Append-only design ensures tamper-proof audit trail'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'angular', to: 'api', label: 'HTTP + JWT', style: 'solid' },
          { id: 'e2', from: 'api', to: 'workflow', label: 'Transition request', style: 'solid' },
          { id: 'e3', from: 'api', to: 'fraud', label: 'Validate', style: 'dashed' },
          { id: 'e4', from: 'workflow', to: 'db', label: 'Update state', style: 'solid' },
          { id: 'e5', from: 'workflow', to: 'audit', label: 'Log change', style: 'solid' },
          { id: 'e6', from: 'fraud', to: 'db', label: 'Check duplicates', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Workflow engine internals and approval stage modules',
        nodes: [
          { id: 'transfer_svc', label: 'Transfer Service', sublabel: 'Submission handler', type: 'service', color: '#512bd4', x: 50, y: 10,
            details: { title: 'Transfer Service', description: 'Handles property transfer initiation. Validates ownership, checks encumbrances, and creates a Draft transfer record.', tech: ['C# Service', 'EF Core', 'Validation'], role: 'Entry point — transfer lifecycle initiation' } },
          { id: 'state_machine', label: 'State Machine', sublabel: 'Transition rules', type: 'service', color: '#7c3aed', x: 15, y: 45,
            details: { title: 'Approval State Machine', description: 'Enforces valid transitions: Draft→Submitted→Officer Review→Admin Approval→Completed. Rejects any out-of-sequence transition.', tech: ['State Machine Pattern', 'C# Enums', 'Guard Clauses'], role: 'Workflow engine — governs transfer lifecycle' } },
          { id: 'fraud_svc', label: 'Fraud Service', sublabel: 'Duplicate detection', type: 'service', color: '#ff0080', x: 85, y: 45,
            details: { title: 'Fraud Detection Service', description: 'Runs SQL uniqueness checks on property ID, owner NID, and document hashes. Flags suspicious patterns for manual review queue.', tech: ['SQL Constraints', 'Hash Comparison', 'Flag System'], role: 'Integrity — prevents fraudulent registrations' } },
          { id: 'audit_svc', label: 'Audit Service', sublabel: 'Immutable logging', type: 'service', color: '#ff9900', x: 50, y: 45,
            details: { title: 'Audit Log Service', description: 'Writes append-only records on every state change. Captures actor, timestamp, old state, new state. No updates or deletes permitted.', tech: ['Append-only Table', 'SQL Triggers', 'EF Core'], role: 'Compliance — tamper-proof change history' } },
          { id: 'db_layer', label: 'Data Layer', sublabel: 'EF Core + SQL', type: 'database', color: '#cc2927', x: 50, y: 80,
            details: { title: 'Data Access Layer', description: 'Repository pattern over EF Core. Partitioned tables by year for historical query performance. Columnstore indexes on audit queries.', tech: ['EF Core', 'Repository Pattern', 'Partitioned Tables'], role: 'Persistence — all property and audit data' } },
        ],
        edges: [
          { id: 'e1', from: 'transfer_svc', to: 'state_machine', label: 'Request transition', style: 'solid' },
          { id: 'e2', from: 'transfer_svc', to: 'fraud_svc', label: 'Validate', style: 'dashed' },
          { id: 'e3', from: 'state_machine', to: 'audit_svc', label: 'Log change', style: 'solid' },
          { id: 'e4', from: 'state_machine', to: 'db_layer', label: 'Persist state', style: 'solid' },
          { id: 'e5', from: 'fraud_svc', to: 'db_layer', label: 'Check duplicates', style: 'dashed' },
        ],
      },
    ],
  },

  // ─── Ticket Platform ──────────────────────────────────────────────────────
  {
    projectId: '8',
    projectSlug: 'ticket-platform',
    projectTitle: 'Ticket Raising Platform',
    summary: 'Jira-like .NET 8 issue tracker with Kanban board, server-side workflow validation, and optimistic concurrency.',
    aiContext: `The Ticket Raising Platform is a .NET 8 Web API with AngularJS Kanban frontend. Tickets (Bug/Task/Story) move through a lifecycle enforced by a server-side workflow validator. Status transitions are validated before persistence. Optimistic concurrency control uses RowVersion tokens to prevent lost updates. MS SQL Server stores tickets, comments, and activity logs. JWT auth with RBAC restricts deletion to Admins.`,
    flowSteps: [
      { nodeId: 'kanban', label: 'User drags ticket', duration: 500 },
      { nodeId: 'api', label: 'Transition requested', duration: 400 },
      { nodeId: 'validator', label: 'Workflow rule checked', duration: 600 },
      { nodeId: 'db', label: 'Status persisted', duration: 500 },
      { nodeId: 'activity', label: 'Activity log written', duration: 400 },
      { nodeId: 'kanban', label: 'Board refreshed', duration: 400 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Kanban board with server-enforced ticket lifecycle and concurrency control',
        nodes: [
          {
            id: 'kanban', label: 'AngularJS Kanban', sublabel: 'Drag-drop board',
            type: 'client', color: '#dd0031', x: 50, y: 8,
            details: {
              title: 'AngularJS Kanban Board',
              description: 'Interactive drag-and-drop Kanban board. Columns: To Do, In Progress, Done. Quick-edit modal for fast updates. Client-side caching for metadata.',
              tech: ['AngularJS', 'Drag & Drop', 'Client Caching'],
              role: 'Presentation — primary team collaboration interface',
            },
          },
          {
            id: 'api', label: '.NET 8 API', sublabel: 'Ticket endpoints',
            type: 'api', color: '#512bd4', x: 50, y: 35,
            details: {
              title: '.NET 8 Web API',
              description: 'REST endpoints for ticket CRUD, status transitions, comments, and assignments. RBAC via JWT claims restricts admin-only actions.',
              tech: ['.NET 8', 'ASP.NET Core', 'JWT RBAC', 'DTOs'],
              role: 'API layer — thin controllers delegating to services',
            },
          },
          {
            id: 'validator', label: 'Workflow Validator', sublabel: 'Transition rules',
            type: 'service', color: '#7c3aed', x: 15, y: 62,
            details: {
              title: 'Workflow Validator',
              description: 'Data-driven rules engine reads allowed transitions from DB. Rejects invalid moves (e.g. Done → In Progress) before any persistence.',
              tech: ['Rules Engine', 'C# Strategy', 'DB-driven Config'],
              role: 'Enforces ticket lifecycle — no illegal state jumps',
              decisions: ['DB-driven rules allow workflow changes without code deployments'],
            },
          },
          {
            id: 'concurrency', label: 'Concurrency Guard', sublabel: 'RowVersion tokens',
            type: 'service', color: '#ff9900', x: 85, y: 62,
            details: {
              title: 'Optimistic Concurrency Control',
              description: 'RowVersion token sent with every update. EF Core throws DbUpdateConcurrencyException if token mismatches, alerting the user of a conflict.',
              tech: ['EF Core RowVersion', 'Optimistic Concurrency', 'Conflict Alerts'],
              role: 'Data integrity — prevents silent lost updates in collaborative editing',
            },
          },
          {
            id: 'db', label: 'MS SQL Server', sublabel: 'Tickets + Comments',
            type: 'database', color: '#cc2927', x: 35, y: 87,
            details: {
              title: 'MS SQL Server',
              description: 'Tables: Tickets, Comments, ActivityLog, WorkflowRules. Indexed on Status, Priority, Assignee for fast Kanban queries.',
              tech: ['MS SQL Server', 'EF Core', 'Non-clustered Indexes'],
              role: 'Persistence — all ticket state and collaboration data',
            },
          },
          {
            id: 'activity', label: 'Activity Log', sublabel: 'Change history',
            type: 'database', color: '#00ff88', x: 65, y: 87,
            details: {
              title: 'Activity Log',
              description: 'Append-only log of every ticket change: who changed what and when. Powers the ticket history timeline in the UI.',
              tech: ['Append-only Table', 'EF Core', 'Timestamps'],
              role: 'Audit — full change history per ticket',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'kanban', to: 'api', label: 'HTTP + JWT', style: 'solid' },
          { id: 'e2', from: 'api', to: 'validator', label: 'Check transition', style: 'solid' },
          { id: 'e3', from: 'api', to: 'concurrency', label: 'RowVersion check', style: 'dashed' },
          { id: 'e4', from: 'validator', to: 'db', label: 'Persist if valid', style: 'solid' },
          { id: 'e5', from: 'validator', to: 'activity', label: 'Log change', style: 'solid' },
          { id: 'e6', from: 'concurrency', to: 'db', label: 'Conflict check', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Ticket lifecycle services and concurrency control internals',
        nodes: [
          { id: 'ticket_svc', label: 'Ticket Service', sublabel: 'CRUD + assignment', type: 'service', color: '#512bd4', x: 50, y: 10,
            details: { title: 'Ticket Service', description: 'Handles ticket creation, updates, assignment, and deletion. Delegates transition requests to the Workflow Validator before any persistence.', tech: ['C# Service', 'EF Core', 'Dependency Injection'], role: 'Core orchestrator — ticket lifecycle management' } },
          { id: 'workflow_svc', label: 'Workflow Validator', sublabel: 'DB-driven rules', type: 'service', color: '#7c3aed', x: 15, y: 45,
            details: { title: 'Workflow Validator Service', description: 'Reads allowed transitions from WorkflowRules table. Rejects invalid moves before persistence. Rules configurable without code changes.', tech: ['Rules Engine', 'DB Config', 'C# Strategy'], role: 'Lifecycle enforcement — no illegal state jumps' } },
          { id: 'concurrency_svc', label: 'Concurrency Guard', sublabel: 'RowVersion tokens', type: 'service', color: '#ff9900', x: 85, y: 45,
            details: { title: 'Optimistic Concurrency Service', description: 'Attaches RowVersion token to every update. EF Core detects mismatches and throws DbUpdateConcurrencyException, triggering conflict resolution UI.', tech: ['EF Core RowVersion', 'Optimistic Locking', 'Conflict Resolution'], role: 'Data integrity — prevents silent lost updates' } },
          { id: 'comment_svc', label: 'Comment Service', sublabel: 'Threaded comments', type: 'service', color: '#00ff88', x: 50, y: 45,
            details: { title: 'Comment Service', description: 'Manages threaded comments per ticket. Supports @mentions and markdown. Appends to ActivityLog on every comment.', tech: ['C# Service', 'EF Core', 'Markdown'], role: 'Collaboration — team communication on tickets' } },
          { id: 'activity_svc', label: 'Activity Logger', sublabel: 'Append-only log', type: 'database', color: '#00d4ff', x: 50, y: 80,
            details: { title: 'Activity Log Service', description: 'Append-only log of every ticket change. Powers the history timeline. Written asynchronously to avoid blocking the main operation.', tech: ['Append-only Table', 'Async Write', 'EF Core'], role: 'Audit — full change history per ticket' } },
        ],
        edges: [
          { id: 'e1', from: 'ticket_svc', to: 'workflow_svc', label: 'Validate transition', style: 'solid' },
          { id: 'e2', from: 'ticket_svc', to: 'concurrency_svc', label: 'RowVersion check', style: 'dashed' },
          { id: 'e3', from: 'ticket_svc', to: 'comment_svc', label: 'Add comment', style: 'solid' },
          { id: 'e4', from: 'ticket_svc', to: 'activity_svc', label: 'Log change', style: 'solid' },
          { id: 'e5', from: 'comment_svc', to: 'activity_svc', label: 'Log comment', style: 'dashed' },
        ],
      },
    ],
  },

  // ─── Admin Analytics Dashboard ────────────────────────────────────────────
  {
    projectId: '9',
    projectSlug: 'admin-analytics-dashboard',
    projectTitle: 'Admin Analytics Dashboard',
    summary: 'Centralized KPI aggregation dashboard pulling real-time metrics from 3 enterprise systems with role-based data filtering.',
    aiContext: `The Admin Analytics Dashboard is a .NET 8 aggregation API with an AngularJS chart frontend. It pulls KPIs from BookNow, Ticket Platform, and Property Registry databases via optimized SQL views. A Data Normalization Layer maps disparate status codes to a unified analytics schema. JWT role claims filter data visibility per management tier. Materialized views pre-compute heavy KPIs to reduce latency. Reports export as CSV and PDF.`,
    flowSteps: [
      { nodeId: 'angular', label: 'Manager opens dashboard', duration: 600 },
      { nodeId: 'api', label: 'Role-filtered request', duration: 500 },
      { nodeId: 'aggregator', label: 'KPIs computed', duration: 800 },
      { nodeId: 'normalizer', label: 'Data normalized', duration: 500 },
      { nodeId: 'db', label: 'SQL views queried', duration: 600 },
      { nodeId: 'angular', label: 'Charts rendered', duration: 500 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Cross-system KPI aggregation with role-based data visibility',
        nodes: [
          {
            id: 'angular', label: 'AngularJS Dashboard', sublabel: 'Charts + Export',
            type: 'client', color: '#dd0031', x: 50, y: 8,
            details: {
              title: 'AngularJS Analytics UI',
              description: 'Interactive charts (time-series, pie, heatmaps) with drill-down. Role-based layout shows different KPI sets per management tier. CSV/PDF export.',
              tech: ['AngularJS', 'Chart Libraries', 'CSV/PDF Export'],
              role: 'Visualization — translates aggregated data into actionable insights',
            },
          },
          {
            id: 'api', label: '.NET 8 Agg. API', sublabel: 'KPI endpoints',
            type: 'api', color: '#512bd4', x: 50, y: 35,
            details: {
              title: '.NET 8 Aggregation API',
              description: 'Dedicated analytics endpoints. JWT role claims applied at service layer to filter data scope. Response caching for non-real-time endpoints.',
              tech: ['.NET 8', 'JWT RBAC', 'Response Caching', 'Swagger'],
              role: 'API gateway — role-aware KPI delivery',
            },
          },
          {
            id: 'aggregator', label: 'KPI Aggregator', sublabel: 'Materialized views',
            type: 'service', color: '#7c3aed', x: 15, y: 62,
            details: {
              title: 'KPI Aggregation Service',
              description: 'Pre-computes heavy KPIs into materialized analytics tables on a schedule. Real-time endpoints query these tables instead of raw data.',
              tech: ['Materialized Views', 'Scheduled Jobs', 'SQL Aggregation'],
              role: 'Performance — eliminates on-the-fly computation latency',
              decisions: ['Materialized views cut API latency from 2s to under 100ms for complex KPIs'],
            },
          },
          {
            id: 'normalizer', label: 'Data Normalizer', sublabel: 'Unified schema',
            type: 'service', color: '#ff9900', x: 85, y: 62,
            details: {
              title: 'Data Normalization Layer',
              description: 'Maps disparate status codes across systems to a unified analytics schema (e.g. "Booked" = "Confirmed" = "Approved"). Ensures consistent cross-system reporting.',
              tech: ['C# Mapping Layer', 'Enum Normalization', 'DTO Projection'],
              role: 'Data consistency — single source of truth for cross-system metrics',
            },
          },
          {
            id: 'db', label: 'MS SQL Server', sublabel: '3 system databases',
            type: 'database', color: '#cc2927', x: 50, y: 87,
            details: {
              title: 'Cross-System SQL Views',
              description: 'SQL views join data from BookNow, Ticket Platform, and Property Registry schemas. Columnstore indexes accelerate aggregation queries on large datasets.',
              tech: ['MS SQL Server', 'SQL Views', 'Columnstore Indexes', 'EF Core'],
              role: 'Data source — unified view across all three enterprise systems',
              decisions: ['Columnstore indexes speed up aggregation queries by 5-10x over row-store'],
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'angular', to: 'api', label: 'HTTP + JWT', style: 'solid' },
          { id: 'e2', from: 'api', to: 'aggregator', label: 'Fetch KPIs', style: 'solid' },
          { id: 'e3', from: 'api', to: 'normalizer', label: 'Normalize', style: 'dashed' },
          { id: 'e4', from: 'aggregator', to: 'db', label: 'SQL views', style: 'solid' },
          { id: 'e5', from: 'normalizer', to: 'db', label: 'Map schema', style: 'dashed' },
          { id: 'e6', from: 'aggregator', to: 'normalizer', label: 'Raw data', style: 'dashed' },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'KPI aggregation pipeline and data normalization internals',
        nodes: [
          { id: 'kpi_svc', label: 'KPI Service', sublabel: 'Metric computation', type: 'service', color: '#512bd4', x: 50, y: 10,
            details: { title: 'KPI Computation Service', description: 'Computes KPIs per system (bookings/day, ticket resolution rate, property transfer volume). Reads from materialized views for sub-100ms response.', tech: ['C# Service', 'Materialized Views', 'LINQ'], role: 'Analytics core — KPI calculation and delivery' } },
          { id: 'cache_svc', label: 'Cache Service', sublabel: 'Response caching', type: 'cache', color: '#ff9900', x: 15, y: 45,
            details: { title: 'Response Cache Service', description: 'Caches non-real-time KPI responses for 5 minutes. Cache invalidated on scheduled materialized view refresh. Reduces DB load by ~70%.', tech: ['ASP.NET Response Caching', 'Cache-Control', 'ETags'], role: 'Performance — eliminates redundant DB queries' } },
          { id: 'norm_svc', label: 'Normalizer', sublabel: 'Schema mapping', type: 'service', color: '#7c3aed', x: 85, y: 45,
            details: { title: 'Data Normalization Service', description: 'Maps status codes across systems to unified analytics enums. BookNow "Confirmed" = Ticket "Resolved" = Registry "Approved" in analytics schema.', tech: ['C# Mapping', 'Enum Normalization', 'AutoMapper'], role: 'Consistency — unified cross-system reporting schema' } },
          { id: 'export_svc', label: 'Export Service', sublabel: 'CSV + PDF', type: 'service', color: '#00ff88', x: 50, y: 45,
            details: { title: 'Report Export Service', description: 'Generates CSV and PDF reports from KPI data. PDF uses a template engine. Exports are streamed to avoid memory spikes on large datasets.', tech: ['CSV Generation', 'PDF Template', 'Stream Response'], role: 'Reporting — downloadable analytics exports' } },
          { id: 'view_layer', label: 'SQL View Layer', sublabel: 'Materialized views', type: 'database', color: '#cc2927', x: 50, y: 80,
            details: { title: 'Materialized View Layer', description: 'Pre-computed SQL views join data from all three system databases. Columnstore indexes accelerate aggregation. Refreshed on a 5-minute schedule.', tech: ['Materialized Views', 'Columnstore Indexes', 'Scheduled Refresh'], role: 'Data source — pre-aggregated cross-system metrics' } },
        ],
        edges: [
          { id: 'e1', from: 'kpi_svc', to: 'cache_svc', label: 'Cache check', style: 'dashed' },
          { id: 'e2', from: 'kpi_svc', to: 'norm_svc', label: 'Normalize', style: 'solid' },
          { id: 'e3', from: 'kpi_svc', to: 'export_svc', label: 'Export request', style: 'dashed' },
          { id: 'e4', from: 'kpi_svc', to: 'view_layer', label: 'Query views', style: 'solid' },
          { id: 'e5', from: 'norm_svc', to: 'view_layer', label: 'Map schema', style: 'dashed' },
        ],
      },
    ],
  },

  // ─── Portfolio ──────────────────────────────────────────────────────────────────
  {
    projectId: '10',
    projectSlug: 'portfolio',
    projectTitle: 'Developer Portfolio',
    summary: 'Next.js 14 portfolio with AI assistant, interactive SVG architecture explorer, draggable ER diagrams, skills graph, and live GitHub stats.',
    aiContext: `This portfolio is a Next.js 14 App Router application built entirely in TypeScript. The frontend uses TailwindCSS and Framer Motion. An AI assistant powered by OpenAI GPT-4o answers questions about the portfolio with full project context injected as a system prompt. Architecture diagrams are custom SVG engines with Framer Motion animations and request flow simulation. Database schemas are draggable ER diagrams with live edge redraw. The skills section is an interactive SVG network graph. GitHub stats are fetched live via the GitHub API. All data is stored in typed TypeScript files — no CMS or database.`,
    flowSteps: [
      { nodeId: 'browser',   label: 'User visits portfolio',        duration: 500 },
      { nodeId: 'nextjs',    label: 'App Router renders page',       duration: 400 },
      { nodeId: 'ai',        label: 'AI assistant answers query',    duration: 800 },
      { nodeId: 'github',    label: 'GitHub API fetches live stats', duration: 600 },
      { nodeId: 'diagrams',  label: 'SVG diagrams rendered',        duration: 500 },
      { nodeId: 'browser',   label: 'Interactive UI ready',         duration: 400 },
    ],
    levels: [
      {
        level: 'overview',
        label: 'System Overview',
        description: 'Next.js 14 App Router — data-driven, AI-powered, fully interactive portfolio',
        nodes: [
          {
            id: 'browser', label: 'Browser Client', sublabel: 'React · Framer Motion',
            type: 'client', color: '#ffffff', x: 50, y: 6,
            details: {
              title: 'Next.js 14 Frontend',
              description: 'App Router with React Server Components for static sections and Client Components for interactive diagrams. TailwindCSS for styling, Framer Motion for animations.',
              tech: ['Next.js 14', 'React 18', 'TailwindCSS', 'Framer Motion', 'TypeScript'],
              role: 'Presentation layer — renders all UI, handles interactivity',
              decisions: ['App Router chosen for RSC support — static sections ship zero JS'],
            },
          },
          {
            id: 'data_layer', label: 'TypeScript Data Layer', sublabel: 'Projects · Arch · Schemas',
            type: 'database', color: '#3178c6', x: 50, y: 28,
            details: {
              title: 'Typed Data Layer',
              description: 'All portfolio content lives in strongly-typed TypeScript files: projects.ts, architectures/index.ts, databaseSchemas/index.ts, skills.ts. Zero CMS, zero API calls for content.',
              tech: ['TypeScript', 'Static Data Files', 'Type Safety'],
              role: 'Content layer — single source of truth for all portfolio data',
              decisions: ['TypeScript data files over CMS — zero latency, full type safety, version-controlled content'],
            },
          },
          {
            id: 'diagrams', label: 'SVG Diagram Engines', sublabel: 'Arch · DB · Skills',
            type: 'ui', color: '#ff9900', x: 20, y: 50,
            details: {
              title: 'Custom SVG Diagram Engines',
              description: 'Three custom SVG engines: ArchDiagram (architecture with flow simulation), DatabaseDiagram (draggable ER with live edges), SkillsGraph (network graph). All data-driven from the TypeScript layer.',
              tech: ['SVG', 'Framer Motion', 'Pointer Events API', 'React'],
              role: 'Visualization layer — turns data into interactive engineering tools',
              decisions: ['SVG over Canvas — accessible, animatable with Framer Motion, scales perfectly at any DPI'],
            },
          },
          {
            id: 'ai', label: 'AI Assistant', sublabel: 'OpenAI GPT-4o',
            type: 'external', color: '#00d4aa', x: 80, y: 50,
            details: {
              title: 'AI Assistant — OpenAI GPT-4o',
              description: 'Context-aware AI chat. Full portfolio context (all projects, tech stacks, architecture decisions) injected as system prompt. Streaming responses via OpenAI API route.',
              tech: ['OpenAI GPT-4o', 'Streaming API', 'Next.js Route Handler', 'System Prompt Engineering'],
              role: 'Intelligence layer — answers technical questions about any project',
              decisions: ['System prompt injection gives the model full context without user needing to explain anything'],
            },
          },
          {
            id: 'github', label: 'GitHub API', sublabel: 'Live stats · Repos',
            type: 'external', color: '#ffffff', x: 50, y: 72,
            details: {
              title: 'GitHub Live Stats',
              description: 'Fetches real-time repo stats, contribution counts, and top languages via GitHub REST API. Cached at edge with Next.js revalidate to avoid rate limits.',
              tech: ['GitHub REST API', 'Next.js Route Handler', 'Edge Caching', 'revalidate'],
              role: 'Live data — keeps GitHub section always up to date',
            },
          },
          {
            id: 'vercel', label: 'Vercel Edge', sublabel: 'Deployment · CDN',
            type: 'storage', color: '#ffffff', x: 50, y: 90,
            details: {
              title: 'Vercel Deployment',
              description: 'Deployed on Vercel Edge Network. Static pages pre-rendered at build time. API routes run as serverless functions. Global CDN for assets.',
              tech: ['Vercel', 'Edge Network', 'Serverless Functions', 'CDN'],
              role: 'Infrastructure — global delivery with zero-config deployment',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'browser',     to: 'data_layer', label: 'Import data',      style: 'solid'  },
          { id: 'e2', from: 'browser',     to: 'diagrams',   label: 'Render diagrams', style: 'solid'  },
          { id: 'e3', from: 'browser',     to: 'ai',         label: 'Chat query',      style: 'dashed' },
          { id: 'e4', from: 'browser',     to: 'github',     label: 'Fetch stats',     style: 'dashed' },
          { id: 'e5', from: 'data_layer',  to: 'diagrams',   label: 'Schema data',     style: 'solid'  },
          { id: 'e6', from: 'vercel',      to: 'browser',    label: 'Serve app',       style: 'solid'  },
        ],
      },
      {
        level: 'service',
        label: 'Service Breakdown',
        description: 'Component architecture — diagram engines, AI pipeline, data flow',
        nodes: [
          {
            id: 'arch_engine', label: 'Arch Diagram Engine', sublabel: 'Flow sim · Compare · AI',
            type: 'ui', color: '#00d4ff', x: 50, y: 8,
            details: {
              title: 'SystemDesignEngine',
              description: 'Interactive architecture explorer. Renders SVG node graphs from typed data. Supports flow simulation (setTimeout chain), side-by-side compare mode, level tabs (Overview/Service), and AI explanation panel.',
              tech: ['SVG', 'Framer Motion', 'React State', 'useRef', 'setTimeout'],
              role: 'Architecture visualization — the centrepiece of the engineering section',
              decisions: ['Flow simulation uses setTimeout chain with cleanup on unmount to prevent memory leaks'],
            },
          },
          {
            id: 'db_engine', label: 'DB Diagram Engine', sublabel: 'Drag · Live edges · Inspect',
            type: 'ui', color: '#ff9900', x: 15, y: 40,
            details: {
              title: 'DatabaseDiagram',
              description: 'Draggable ER diagram engine. Tables are SVG groups with pointer event drag (window-level listeners). Relationship edges redraw live from positions state. ClipPath per row prevents text overflow.',
              tech: ['SVG', 'Pointer Events API', 'window.addEventListener', 'React State', 'ClipPath'],
              role: 'Database visualization — makes schema design tangible and explorable',
              decisions: ['Window-level pointermove/up listeners prevent drag getting stuck when mouse leaves SVG'],
            },
          },
          {
            id: 'skills_graph', label: 'Skills Graph', sublabel: 'Network · Hover · Animate',
            type: 'ui', color: '#7c3aed', x: 50, y: 40,
            details: {
              title: 'SkillsGraph',
              description: 'SVG network graph showing skill categories as nodes with weighted edges. Hover highlights connected nodes and dims others. Skill bars animate on hover.',
              tech: ['SVG', 'Framer Motion', 'React State', 'AnimatePresence'],
              role: 'Skills visualization — shows how technologies connect',
            },
          },
          {
            id: 'ai_pipeline', label: 'AI Pipeline', sublabel: 'Context · Stream · Fallback',
            type: 'service', color: '#00d4aa', x: 85, y: 40,
            details: {
              title: 'AI Assistant Pipeline',
              description: 'System prompt contains full portfolio context. User message appended. OpenAI streaming response piped through Next.js route handler. Client reads stream chunks and appends to UI. Falls back to static summary on API error.',
              tech: ['OpenAI SDK', 'ReadableStream', 'Next.js Route Handler', 'Error Boundary'],
              role: 'AI layer — context-aware technical Q&A',
              decisions: ['Streaming chosen over batch response — perceived latency near-zero even for long answers'],
            },
          },
          {
            id: 'cmd_palette', label: 'Command Palette', sublabel: '⌘K · Search · Navigate',
            type: 'ui', color: '#ff0080', x: 15, y: 72,
            details: {
              title: 'Command Palette',
              description: 'Global ⌘K command palette for instant navigation. Searches projects, sections, and actions. Keyboard-first UX with fuzzy matching.',
              tech: ['React Portal', 'useEffect keyboard listener', 'Fuzzy Search'],
              role: 'Navigation — power-user shortcut to any section',
            },
          },
          {
            id: 'github_svc', label: 'GitHub Service', sublabel: 'API · Cache · Transform',
            type: 'external', color: '#ffffff', x: 50, y: 72,
            details: {
              title: 'GitHub Data Service',
              description: 'Next.js API route fetches GitHub REST API with auth token. Transforms raw response into typed GitHubStats object. Cached with revalidate:3600 to avoid rate limits.',
              tech: ['GitHub REST API', 'Next.js Route Handler', 'revalidate', 'TypeScript'],
              role: 'Live data — real contribution and repo stats',
            },
          },
          {
            id: 'data_svc', label: 'Data Layer', sublabel: 'TypeScript · Typed · Static',
            type: 'database', color: '#3178c6', x: 85, y: 72,
            details: {
              title: 'TypeScript Static Data Layer',
              description: 'projects.ts, architectures/index.ts, databaseSchemas/index.ts, skills.ts. All strongly typed. Imported directly by components — zero API calls, zero latency, tree-shaken at build time.',
              tech: ['TypeScript', 'Static Imports', 'Tree Shaking', 'Type Safety'],
              role: 'Content — single source of truth for all portfolio data',
            },
          },
        ],
        edges: [
          { id: 'e1', from: 'arch_engine',  to: 'data_svc',     label: 'Architecture data', style: 'solid'  },
          { id: 'e2', from: 'db_engine',    to: 'data_svc',     label: 'Schema data',       style: 'solid'  },
          { id: 'e3', from: 'skills_graph', to: 'data_svc',     label: 'Skills data',       style: 'solid'  },
          { id: 'e4', from: 'ai_pipeline',  to: 'data_svc',     label: 'Context inject',    style: 'dashed' },
          { id: 'e5', from: 'cmd_palette',  to: 'arch_engine',  label: 'Navigate to',       style: 'dashed' },
          { id: 'e6', from: 'github_svc',   to: 'data_svc',     label: 'Merge live data',   style: 'dashed' },
        ],
      },
    ],
  },
]

export function getArchitectureBySlug(slug: string): ArchitectureDiagram | undefined {
  return architectures.find((a) => a.projectSlug === slug)
}

export function getArchitectureById(id: string): ArchitectureDiagram | undefined {
  return architectures.find((a) => a.projectId === id)
}
