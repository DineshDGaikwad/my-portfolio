// ─── Database Schema Types ────────────────────────────────────────────────────

export type ColumnType =
  | 'INT' | 'BIGINT' | 'VARCHAR' | 'TEXT' | 'BOOLEAN'
  | 'DATETIME' | 'DECIMAL' | 'UUID' | 'ENUM' | 'JSON'

export interface Column {
  name: string
  type: ColumnType
  length?: number
  isPK?: boolean
  isFK?: boolean
  isNullable?: boolean
  isUnique?: boolean
  isIndex?: boolean
  defaultValue?: string
  references?: { table: string; column: string }
  enumValues?: string[]
}

export interface DBTable {
  id: string
  name: string
  color: string
  // Position as percentage of viewBox (0–100)
  x: number
  y: number
  columns: Column[]
  description?: string
}

export type RelationType = 'one-to-many' | 'many-to-many' | 'one-to-one'

export interface Relationship {
  id: string
  fromTable: string
  fromColumn: string
  toTable: string
  toColumn: string
  type: RelationType
  label?: string
}

export interface DatabaseSchema {
  projectId: string
  projectSlug: string
  projectTitle: string
  description: string
  tables: DBTable[]
  relationships: Relationship[]
}

// ─── BookNow (BookMyShow-style) ──────────────────────────────────────────────
const bookNowSchema: DatabaseSchema = {
  projectId: '6',
  projectSlug: 'booknow',
  projectTitle: 'BookNow',
  description: 'BookMyShow-style appointment & event booking — slot locking, payments, waitlist, notifications',
  tables: [
    {
      id: 'users',
      name: 'Users',
      color: '#00d4ff',
      x: 2,
      y: 2,
      description: 'Registered users — customers, providers, admins',
      columns: [
        { name: 'id',            type: 'INT',     isPK: true },
        { name: 'full_name',     type: 'VARCHAR', length: 120 },
        { name: 'email',         type: 'VARCHAR', length: 180, isUnique: true },
        { name: 'phone',         type: 'VARCHAR', length: 20,  isUnique: true },
        { name: 'password_hash', type: 'VARCHAR', length: 255 },
        { name: 'role',          type: 'ENUM',    enumValues: ['Admin','Customer','Provider'] },
        { name: 'is_verified',   type: 'BOOLEAN', defaultValue: 'false' },
        { name: 'avatar_url',    type: 'VARCHAR', length: 500, isNullable: true },
        { name: 'created_at',    type: 'DATETIME', defaultValue: 'NOW()' },
      ],
    },
    {
      id: 'venues',
      name: 'Venues',
      color: '#7c3aed',
      x: 55,
      y: 2,
      description: 'Physical or virtual venue where services are offered',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'owner_id',    type: 'INT',     isFK: true, references: { table: 'Users', column: 'id' } },
        { name: 'name',        type: 'VARCHAR', length: 150 },
        { name: 'city',        type: 'VARCHAR', length: 80,  isIndex: true },
        { name: 'address',     type: 'TEXT' },
        { name: 'latitude',    type: 'DECIMAL', isNullable: true },
        { name: 'longitude',   type: 'DECIMAL', isNullable: true },
        { name: 'is_active',   type: 'BOOLEAN', defaultValue: 'true' },
      ],
    },
    {
      id: 'services',
      name: 'Services',
      color: '#f59e0b',
      x: 55,
      y: 42,
      description: 'Bookable services / shows / events offered at a venue',
      columns: [
        { name: 'id',           type: 'INT',     isPK: true },
        { name: 'venue_id',     type: 'INT',     isFK: true, references: { table: 'Venues', column: 'id' } },
        { name: 'name',         type: 'VARCHAR', length: 150 },
        { name: 'category',     type: 'ENUM',    enumValues: ['Movie','Concert','Sports','Appointment','Class'] },
        { name: 'duration_min', type: 'INT' },
        { name: 'price',        type: 'DECIMAL' },
        { name: 'total_seats',  type: 'INT' },
        { name: 'is_active',    type: 'BOOLEAN', defaultValue: 'true' },
      ],
    },
    {
      id: 'slots',
      name: 'Slots',
      color: '#00ff88',
      x: 55,
      y: 76,
      description: 'Time slots for each service — row-locked during booking',
      columns: [
        { name: 'id',             type: 'INT',      isPK: true },
        { name: 'service_id',     type: 'INT',      isFK: true, references: { table: 'Services', column: 'id' } },
        { name: 'start_time',     type: 'DATETIME', isIndex: true },
        { name: 'end_time',       type: 'DATETIME' },
        { name: 'available_seats',type: 'INT' },
        { name: 'locked_seats',   type: 'INT',      defaultValue: '0' },
        { name: 'status',         type: 'ENUM',     enumValues: ['Open','Full','Cancelled'] },
      ],
    },
    {
      id: 'bookings',
      name: 'Bookings',
      color: '#dd0031',
      x: 2,
      y: 44,
      description: 'Customer reservations — atomic slot lock prevents double-booking',
      columns: [
        { name: 'id',             type: 'INT',     isPK: true },
        { name: 'booking_ref',    type: 'VARCHAR', length: 20, isUnique: true },
        { name: 'customer_id',    type: 'INT',     isFK: true, references: { table: 'Users', column: 'id' } },
        { name: 'slot_id',        type: 'INT',     isFK: true, references: { table: 'Slots', column: 'id' } },
        { name: 'seat_count',     type: 'INT' },
        { name: 'status',         type: 'ENUM',    enumValues: ['Pending','Confirmed','Cancelled','NoShow'] },
        { name: 'booked_at',      type: 'DATETIME', defaultValue: 'NOW()' },
        { name: 'cancelled_at',   type: 'DATETIME', isNullable: true },
      ],
    },
    {
      id: 'payments',
      name: 'Payments',
      color: '#ff9900',
      x: 2,
      y: 78,
      description: 'Payment transactions — supports refunds and partial payments',
      columns: [
        { name: 'id',              type: 'INT',     isPK: true },
        { name: 'booking_id',      type: 'INT',     isFK: true, isUnique: true, references: { table: 'Bookings', column: 'id' } },
        { name: 'amount',          type: 'DECIMAL' },
        { name: 'currency',        type: 'VARCHAR', length: 3, defaultValue: 'INR' },
        { name: 'gateway',         type: 'ENUM',    enumValues: ['Razorpay','Stripe','UPI','Cash'] },
        { name: 'gateway_txn_id',  type: 'VARCHAR', length: 100, isNullable: true, isUnique: true },
        { name: 'status',          type: 'ENUM',    enumValues: ['Pending','Paid','Refunded','Failed'] },
        { name: 'paid_at',         type: 'DATETIME', isNullable: true },
      ],
    },
    {
      id: 'waitlist',
      name: 'Waitlist',
      color: '#ff0080',
      x: 28,
      y: 78,
      description: 'Queue for fully-booked slots — auto-promoted on cancellation',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'customer_id', type: 'INT',     isFK: true, references: { table: 'Users', column: 'id' } },
        { name: 'slot_id',     type: 'INT',     isFK: true, references: { table: 'Slots', column: 'id' } },
        { name: 'position',    type: 'INT',     isIndex: true },
        { name: 'joined_at',   type: 'DATETIME', defaultValue: 'NOW()' },
        { name: 'notified',    type: 'BOOLEAN', defaultValue: 'false' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'users',    fromColumn: 'id',         toTable: 'venues',   toColumn: 'owner_id',    type: 'one-to-many', label: 'owns' },
    { id: 'r2', fromTable: 'venues',   fromColumn: 'id',         toTable: 'services', toColumn: 'venue_id',    type: 'one-to-many', label: 'offers' },
    { id: 'r3', fromTable: 'services', fromColumn: 'id',         toTable: 'slots',    toColumn: 'service_id',  type: 'one-to-many', label: 'has slots' },
    { id: 'r4', fromTable: 'users',    fromColumn: 'id',         toTable: 'bookings', toColumn: 'customer_id', type: 'one-to-many', label: 'books' },
    { id: 'r5', fromTable: 'slots',    fromColumn: 'id',         toTable: 'bookings', toColumn: 'slot_id',     type: 'one-to-many', label: 'reserved by' },
    { id: 'r6', fromTable: 'bookings', fromColumn: 'id',         toTable: 'payments', toColumn: 'booking_id',  type: 'one-to-one',  label: 'paid via' },
    { id: 'r7', fromTable: 'users',    fromColumn: 'id',         toTable: 'waitlist', toColumn: 'customer_id', type: 'one-to-many', label: 'queued' },
    { id: 'r8', fromTable: 'slots',    fromColumn: 'id',         toTable: 'waitlist', toColumn: 'slot_id',     type: 'one-to-many', label: 'waitlisted' },
  ],
}

// ─── Property Registry ────────────────────────────────────────────────────────
const propertyRegistrySchema: DatabaseSchema = {
  projectId: '7',
  projectSlug: 'property-registry',
  projectTitle: 'Property Registry',
  description: 'Government-style registry with immutable audit trail and multi-step approval',
  tables: [
    {
      id: 'owners',
      name: 'Owners',
      color: '#00d4ff',
      x: 5,
      y: 5,
      description: 'Property owners / citizens',
      columns: [
        { name: 'Id',        type: 'INT',     isPK: true },
        { name: 'FullName',  type: 'VARCHAR', length: 150 },
        { name: 'NID',       type: 'VARCHAR', length: 20 },
        { name: 'Email',     type: 'VARCHAR', length: 150 },
        { name: 'Phone',     type: 'VARCHAR', length: 20 },
        { name: 'Role',      type: 'ENUM',    enumValues: ['Citizen', 'Officer', 'Admin'] },
      ],
    },
    {
      id: 'properties',
      name: 'Properties',
      color: '#7c3aed',
      x: 60,
      y: 5,
      description: 'Registered property records',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'OwnerId',     type: 'INT',     isFK: true, references: { table: 'Owners', column: 'Id' } },
        { name: 'Title',       type: 'VARCHAR', length: 200 },
        { name: 'Address',     type: 'TEXT' },
        { name: 'Area',        type: 'DECIMAL' },
        { name: 'Status',      type: 'ENUM',    enumValues: ['Active', 'Disputed', 'Transferred'] },
        { name: 'RegisteredAt', type: 'DATETIME' },
      ],
    },
    {
      id: 'transactions',
      name: 'Transactions',
      color: '#00ff88',
      x: 5,
      y: 55,
      description: 'Ownership transfer requests',
      columns: [
        { name: 'Id',           type: 'INT',     isPK: true },
        { name: 'PropertyId',   type: 'INT',     isFK: true, references: { table: 'Properties', column: 'Id' } },
        { name: 'FromOwnerId',  type: 'INT',     isFK: true, references: { table: 'Owners', column: 'Id' } },
        { name: 'ToOwnerId',    type: 'INT',     isFK: true, references: { table: 'Owners', column: 'Id' } },
        { name: 'Status',       type: 'ENUM',    enumValues: ['Draft', 'Submitted', 'OfficerReview', 'AdminApproval', 'Completed', 'Rejected'] },
        { name: 'InitiatedAt',  type: 'DATETIME' },
      ],
    },
    {
      id: 'documents',
      name: 'Documents',
      color: '#ff9900',
      x: 60,
      y: 55,
      description: 'Uploaded supporting documents',
      columns: [
        { name: 'Id',            type: 'INT',     isPK: true },
        { name: 'TransactionId', type: 'INT',     isFK: true, references: { table: 'Transactions', column: 'Id' } },
        { name: 'FileName',      type: 'VARCHAR', length: 255 },
        { name: 'FileHash',      type: 'VARCHAR', length: 64 },
        { name: 'DocType',       type: 'ENUM',    enumValues: ['Deed', 'ID', 'TaxCert', 'Other'] },
        { name: 'UploadedAt',    type: 'DATETIME' },
      ],
    },
    {
      id: 'audit_log',
      name: 'AuditLog',
      color: '#ff0080',
      x: 30,
      y: 82,
      description: 'Immutable append-only change history',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'EntityType',  type: 'VARCHAR', length: 50 },
        { name: 'EntityId',    type: 'INT' },
        { name: 'ActorId',     type: 'INT',     isFK: true, references: { table: 'Owners', column: 'Id' } },
        { name: 'OldState',    type: 'VARCHAR', length: 50 },
        { name: 'NewState',    type: 'VARCHAR', length: 50 },
        { name: 'ChangedAt',   type: 'DATETIME' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'owners',       fromColumn: 'Id',          toTable: 'properties',   toColumn: 'OwnerId',       type: 'one-to-many', label: 'owns' },
    { id: 'r2', fromTable: 'properties',   fromColumn: 'Id',          toTable: 'transactions', toColumn: 'PropertyId',    type: 'one-to-many', label: 'transferred via' },
    { id: 'r3', fromTable: 'owners',       fromColumn: 'Id',          toTable: 'transactions', toColumn: 'FromOwnerId',   type: 'one-to-many', label: 'transfers from' },
    { id: 'r4', fromTable: 'owners',       fromColumn: 'Id',          toTable: 'transactions', toColumn: 'ToOwnerId',     type: 'one-to-many', label: 'transfers to' },
    { id: 'r5', fromTable: 'transactions', fromColumn: 'Id',          toTable: 'documents',    toColumn: 'TransactionId', type: 'one-to-many', label: 'has docs' },
    { id: 'r6', fromTable: 'owners',       fromColumn: 'Id',          toTable: 'audit_log',    toColumn: 'ActorId',       type: 'one-to-many', label: 'logged by' },
  ],
}

// ─── Ticket Platform ──────────────────────────────────────────────────────────
const ticketPlatformSchema: DatabaseSchema = {
  projectId: '8',
  projectSlug: 'ticket-platform',
  projectTitle: 'Ticket Platform',
  description: 'Jira-like tracker with server-enforced lifecycle and optimistic concurrency',
  tables: [
    {
      id: 'users',
      name: 'Users',
      color: '#00d4ff',
      x: 5,
      y: 5,
      description: 'Team members and admins',
      columns: [
        { name: 'Id',           type: 'INT',     isPK: true },
        { name: 'Name',         type: 'VARCHAR', length: 100 },
        { name: 'Email',        type: 'VARCHAR', length: 150 },
        { name: 'Role',         type: 'ENUM',    enumValues: ['Admin', 'Developer', 'Viewer'] },
        { name: 'CreatedAt',    type: 'DATETIME' },
      ],
    },
    {
      id: 'tickets',
      name: 'Tickets',
      color: '#dd0031',
      x: 60,
      y: 5,
      description: 'Core issue tracking entity',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'Title',       type: 'VARCHAR', length: 200 },
        { name: 'Description', type: 'TEXT',    isNullable: true },
        { name: 'Type',        type: 'ENUM',    enumValues: ['Bug', 'Task', 'Story'] },
        { name: 'Status',      type: 'ENUM',    enumValues: ['ToDo', 'InProgress', 'Done'] },
        { name: 'Priority',    type: 'ENUM',    enumValues: ['Low', 'Medium', 'High', 'Critical'] },
        { name: 'AssigneeId',  type: 'INT',     isFK: true, isNullable: true, references: { table: 'Users', column: 'Id' } },
        { name: 'ReporterId',  type: 'INT',     isFK: true, references: { table: 'Users', column: 'Id' } },
        { name: 'RowVersion',  type: 'INT' },
        { name: 'CreatedAt',   type: 'DATETIME' },
      ],
    },
    {
      id: 'comments',
      name: 'Comments',
      color: '#7c3aed',
      x: 60,
      y: 62,
      description: 'Threaded comments per ticket',
      columns: [
        { name: 'Id',        type: 'INT',  isPK: true },
        { name: 'TicketId',  type: 'INT',  isFK: true, references: { table: 'Tickets', column: 'Id' } },
        { name: 'AuthorId',  type: 'INT',  isFK: true, references: { table: 'Users', column: 'Id' } },
        { name: 'Body',      type: 'TEXT' },
        { name: 'CreatedAt', type: 'DATETIME' },
      ],
    },
    {
      id: 'activity_log',
      name: 'ActivityLog',
      color: '#00ff88',
      x: 5,
      y: 62,
      description: 'Append-only change history per ticket',
      columns: [
        { name: 'Id',        type: 'INT',     isPK: true },
        { name: 'TicketId',  type: 'INT',     isFK: true, references: { table: 'Tickets', column: 'Id' } },
        { name: 'ActorId',   type: 'INT',     isFK: true, references: { table: 'Users', column: 'Id' } },
        { name: 'Action',    type: 'VARCHAR', length: 100 },
        { name: 'OldValue',  type: 'VARCHAR', length: 100, isNullable: true },
        { name: 'NewValue',  type: 'VARCHAR', length: 100, isNullable: true },
        { name: 'LoggedAt',  type: 'DATETIME' },
      ],
    },
    {
      id: 'workflow_rules',
      name: 'WorkflowRules',
      color: '#ff9900',
      x: 30,
      y: 85,
      description: 'DB-driven transition rules engine',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'FromStatus',  type: 'VARCHAR', length: 50 },
        { name: 'ToStatus',    type: 'VARCHAR', length: 50 },
        { name: 'AllowedRole', type: 'VARCHAR', length: 50 },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'users',        fromColumn: 'Id',       toTable: 'tickets',        toColumn: 'AssigneeId', type: 'one-to-many', label: 'assigned to' },
    { id: 'r2', fromTable: 'users',        fromColumn: 'Id',       toTable: 'tickets',        toColumn: 'ReporterId', type: 'one-to-many', label: 'reported by' },
    { id: 'r3', fromTable: 'tickets',      fromColumn: 'Id',       toTable: 'comments',       toColumn: 'TicketId',   type: 'one-to-many', label: 'has comments' },
    { id: 'r4', fromTable: 'users',        fromColumn: 'Id',       toTable: 'comments',       toColumn: 'AuthorId',   type: 'one-to-many', label: 'authored by' },
    { id: 'r5', fromTable: 'tickets',      fromColumn: 'Id',       toTable: 'activity_log',   toColumn: 'TicketId',   type: 'one-to-many', label: 'tracked in' },
    { id: 'r6', fromTable: 'users',        fromColumn: 'Id',       toTable: 'activity_log',   toColumn: 'ActorId',    type: 'one-to-many', label: 'acted by' },
  ],
}

// ─── Admin Analytics Dashboard ────────────────────────────────────────────────
const dashboardSchema: DatabaseSchema = {
  projectId: '9',
  projectSlug: 'admin-analytics-dashboard',
  projectTitle: 'Analytics Dashboard',
  description: 'Aggregated KPI views across BookNow, Ticket Platform, and Property Registry',
  tables: [
    {
      id: 'kpi_snapshots',
      name: 'KpiSnapshots',
      color: '#00d4ff',
      x: 5,
      y: 5,
      description: 'Pre-computed KPI materialized snapshots',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'SystemName',  type: 'VARCHAR', length: 50 },
        { name: 'MetricKey',   type: 'VARCHAR', length: 100 },
        { name: 'MetricValue', type: 'DECIMAL' },
        { name: 'Period',      type: 'VARCHAR', length: 20 },
        { name: 'ComputedAt',  type: 'DATETIME' },
      ],
    },
    {
      id: 'report_configs',
      name: 'ReportConfigs',
      color: '#7c3aed',
      x: 60,
      y: 5,
      description: 'Saved report definitions per role',
      columns: [
        { name: 'Id',         type: 'INT',     isPK: true },
        { name: 'OwnerId',    type: 'INT',     isFK: true, references: { table: 'DashboardUsers', column: 'Id' } },
        { name: 'Name',       type: 'VARCHAR', length: 100 },
        { name: 'Filters',    type: 'JSON' },
        { name: 'Systems',    type: 'JSON' },
        { name: 'CreatedAt',  type: 'DATETIME' },
      ],
    },
    {
      id: 'dashboard_users',
      name: 'DashboardUsers',
      color: '#dd0031',
      x: 5,
      y: 55,
      description: 'Managers with role-scoped data access',
      columns: [
        { name: 'Id',         type: 'INT',     isPK: true },
        { name: 'Name',       type: 'VARCHAR', length: 100 },
        { name: 'Email',      type: 'VARCHAR', length: 150 },
        { name: 'Role',       type: 'ENUM',    enumValues: ['SuperAdmin', 'Manager', 'Viewer'] },
        { name: 'DataScope',  type: 'JSON' },
      ],
    },
    {
      id: 'export_logs',
      name: 'ExportLogs',
      color: '#00ff88',
      x: 60,
      y: 55,
      description: 'Audit trail for all report exports',
      columns: [
        { name: 'Id',         type: 'INT',     isPK: true },
        { name: 'UserId',     type: 'INT',     isFK: true, references: { table: 'DashboardUsers', column: 'Id' } },
        { name: 'ReportId',   type: 'INT',     isFK: true, isNullable: true, references: { table: 'ReportConfigs', column: 'Id' } },
        { name: 'Format',     type: 'ENUM',    enumValues: ['CSV', 'PDF'] },
        { name: 'ExportedAt', type: 'DATETIME' },
      ],
    },
    {
      id: 'system_health',
      name: 'SystemHealth',
      color: '#ff9900',
      x: 30,
      y: 82,
      description: 'Source system availability tracking',
      columns: [
        { name: 'Id',          type: 'INT',     isPK: true },
        { name: 'SystemName',  type: 'VARCHAR', length: 50 },
        { name: 'Status',      type: 'ENUM',    enumValues: ['Online', 'Degraded', 'Offline'] },
        { name: 'LastChecked', type: 'DATETIME' },
        { name: 'Latency',     type: 'INT' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'dashboard_users', fromColumn: 'Id',       toTable: 'report_configs', toColumn: 'OwnerId',  type: 'one-to-many', label: 'owns' },
    { id: 'r2', fromTable: 'dashboard_users', fromColumn: 'Id',       toTable: 'export_logs',    toColumn: 'UserId',   type: 'one-to-many', label: 'exports' },
    { id: 'r3', fromTable: 'report_configs',  fromColumn: 'Id',       toTable: 'export_logs',    toColumn: 'ReportId', type: 'one-to-many', label: 'exported as' },
  ],
}

// ─── Tesla Academy ───────────────────────────────────────────────────────────
const teslaAcademySchema: DatabaseSchema = {
  projectId: '1',
  projectSlug: 'tesla-academy',
  projectTitle: 'Tesla Academy',
  description: 'MongoDB document store — users, courses, enrollments, and progress tracking',
  tables: [
    {
      id: 'users',
      name: 'users',
      color: '#61dafb',
      x: 5,
      y: 5,
      description: 'Registered students and admins',
      columns: [
        { name: '_id',          type: 'UUID',    isPK: true },
        { name: 'name',         type: 'VARCHAR', length: 100 },
        { name: 'email',        type: 'VARCHAR', length: 150 },
        { name: 'password_hash',type: 'VARCHAR', length: 255 },
        { name: 'role',         type: 'ENUM',    enumValues: ['admin', 'student'] },
        { name: 'created_at',   type: 'DATETIME' },
      ],
    },
    {
      id: 'courses',
      name: 'courses',
      color: '#009688',
      x: 60,
      y: 5,
      description: 'Course content and metadata',
      columns: [
        { name: '_id',         type: 'UUID',    isPK: true },
        { name: 'title',       type: 'VARCHAR', length: 200 },
        { name: 'description', type: 'TEXT' },
        { name: 'instructor_id', type: 'UUID',  isFK: true, references: { table: 'users', column: '_id' } },
        { name: 'thumbnail_url', type: 'VARCHAR', length: 500, isNullable: true },
        { name: 'is_published', type: 'BOOLEAN' },
        { name: 'created_at',  type: 'DATETIME' },
      ],
    },
    {
      id: 'enrollments',
      name: 'enrollments',
      color: '#7c3aed',
      x: 5,
      y: 55,
      description: 'Student course enrollments',
      columns: [
        { name: '_id',         type: 'UUID',     isPK: true },
        { name: 'student_id',  type: 'UUID',     isFK: true, references: { table: 'users', column: '_id' } },
        { name: 'course_id',   type: 'UUID',     isFK: true, references: { table: 'courses', column: '_id' } },
        { name: 'enrolled_at', type: 'DATETIME' },
        { name: 'status',      type: 'ENUM',     enumValues: ['active', 'completed', 'dropped'] },
      ],
    },
    {
      id: 'progress',
      name: 'progress',
      color: '#ff9900',
      x: 60,
      y: 55,
      description: 'Per-lesson progress tracking',
      columns: [
        { name: '_id',          type: 'UUID',    isPK: true },
        { name: 'student_id',   type: 'UUID',    isFK: true, references: { table: 'users', column: '_id' } },
        { name: 'course_id',    type: 'UUID',    isFK: true, references: { table: 'courses', column: '_id' } },
        { name: 'lesson_index', type: 'INT' },
        { name: 'completed',    type: 'BOOLEAN' },
        { name: 'updated_at',   type: 'DATETIME' },
      ],
    },
    {
      id: 'media_assets',
      name: 'media_assets',
      color: '#47a248',
      x: 30,
      y: 82,
      description: 'S3 media references per course',
      columns: [
        { name: '_id',       type: 'UUID',    isPK: true },
        { name: 'course_id', type: 'UUID',    isFK: true, references: { table: 'courses', column: '_id' } },
        { name: 's3_key',    type: 'VARCHAR', length: 500 },
        { name: 'type',      type: 'ENUM',    enumValues: ['video', 'pdf', 'image'] },
        { name: 'size_bytes',type: 'BIGINT' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'users',       fromColumn: '_id',       toTable: 'courses',      toColumn: 'instructor_id', type: 'one-to-many', label: 'instructs' },
    { id: 'r2', fromTable: 'users',       fromColumn: '_id',       toTable: 'enrollments',  toColumn: 'student_id',   type: 'one-to-many', label: 'enrolls' },
    { id: 'r3', fromTable: 'courses',     fromColumn: '_id',       toTable: 'enrollments',  toColumn: 'course_id',    type: 'one-to-many', label: 'enrolled in' },
    { id: 'r4', fromTable: 'users',       fromColumn: '_id',       toTable: 'progress',     toColumn: 'student_id',   type: 'one-to-many', label: 'tracks' },
    { id: 'r5', fromTable: 'courses',     fromColumn: '_id',       toTable: 'progress',     toColumn: 'course_id',    type: 'one-to-many', label: 'progress for' },
    { id: 'r6', fromTable: 'courses',     fromColumn: '_id',       toTable: 'media_assets', toColumn: 'course_id',    type: 'one-to-many', label: 'has media' },
  ],
}

// ─── FitClub ──────────────────────────────────────────────────────────────────
const fitClubSchema: DatabaseSchema = {
  projectId: '2',
  projectSlug: 'fitclub',
  projectTitle: 'FitClub',
  description: 'Client-side state model — localStorage-persisted workout and user data (no server DB)',
  tables: [
    {
      id: 'user_profile',
      name: 'UserProfile',
      color: '#61dafb',
      x: 5,
      y: 8,
      description: 'Logged-in user identity and role (localStorage)',
      columns: [
        { name: 'id',       type: 'VARCHAR', length: 36, isPK: true },
        { name: 'name',     type: 'VARCHAR', length: 100 },
        { name: 'email',    type: 'VARCHAR', length: 150 },
        { name: 'role',     type: 'ENUM',    enumValues: ['admin', 'user'] },
        { name: 'joinedAt', type: 'DATETIME' },
      ],
    },
    {
      id: 'workout_plans',
      name: 'WorkoutPlans',
      color: '#7c3aed',
      x: 60,
      y: 8,
      description: 'Admin-created workout programs',
      columns: [
        { name: 'id',          type: 'VARCHAR', length: 36, isPK: true },
        { name: 'title',       type: 'VARCHAR', length: 100 },
        { name: 'category',    type: 'ENUM',    enumValues: ['Strength', 'Cardio', 'Flexibility', 'HIIT'] },
        { name: 'difficulty',  type: 'ENUM',    enumValues: ['Beginner', 'Intermediate', 'Advanced'] },
        { name: 'created_by',  type: 'VARCHAR', length: 36, isFK: true, references: { table: 'UserProfile', column: 'id' } },
      ],
    },
    {
      id: 'exercises',
      name: 'Exercises',
      color: '#00ff88',
      x: 60,
      y: 55,
      description: 'Individual exercises within a plan',
      columns: [
        { name: 'id',       type: 'VARCHAR', length: 36, isPK: true },
        { name: 'plan_id',  type: 'VARCHAR', length: 36, isFK: true, references: { table: 'WorkoutPlans', column: 'id' } },
        { name: 'name',     type: 'VARCHAR', length: 100 },
        { name: 'sets',     type: 'INT' },
        { name: 'reps',     type: 'INT' },
        { name: 'duration', type: 'INT',     isNullable: true },
      ],
    },
    {
      id: 'user_progress',
      name: 'UserProgress',
      color: '#ff9900',
      x: 5,
      y: 55,
      description: 'Per-user workout completion log',
      columns: [
        { name: 'id',          type: 'VARCHAR', length: 36, isPK: true },
        { name: 'user_id',     type: 'VARCHAR', length: 36, isFK: true, references: { table: 'UserProfile', column: 'id' } },
        { name: 'plan_id',     type: 'VARCHAR', length: 36, isFK: true, references: { table: 'WorkoutPlans', column: 'id' } },
        { name: 'completed_at',type: 'DATETIME' },
        { name: 'notes',       type: 'TEXT',    isNullable: true },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'user_profile',  fromColumn: 'id',      toTable: 'workout_plans', toColumn: 'created_by', type: 'one-to-many', label: 'creates' },
    { id: 'r2', fromTable: 'workout_plans', fromColumn: 'id',      toTable: 'exercises',     toColumn: 'plan_id',    type: 'one-to-many', label: 'contains' },
    { id: 'r3', fromTable: 'user_profile',  fromColumn: 'id',      toTable: 'user_progress', toColumn: 'user_id',    type: 'one-to-many', label: 'logs' },
    { id: 'r4', fromTable: 'workout_plans', fromColumn: 'id',      toTable: 'user_progress', toColumn: 'plan_id',    type: 'one-to-many', label: 'tracked in' },
  ],
}

// ─── CVFS ─────────────────────────────────────────────────────────────────────
const cvfsSchema: DatabaseSchema = {
  projectId: '3',
  projectSlug: 'cvfs',
  projectTitle: 'CVFS',
  description: 'In-memory C++ data model — inode table, directory tree, and permission bitmasks',
  tables: [
    {
      id: 'inode_table',
      name: 'InodeTable',
      color: '#00d4ff',
      x: 5,
      y: 8,
      description: 'Core inode metadata store (unordered_map)',
      columns: [
        { name: 'inode_id',    type: 'INT',     isPK: true },
        { name: 'name',        type: 'VARCHAR', length: 255 },
        { name: 'is_directory',type: 'BOOLEAN' },
        { name: 'permissions', type: 'INT' },
        { name: 'size_bytes',  type: 'BIGINT' },
        { name: 'created_at',  type: 'DATETIME' },
        { name: 'modified_at', type: 'DATETIME' },
      ],
    },
    {
      id: 'file_content',
      name: 'FileContent',
      color: '#7c3aed',
      x: 60,
      y: 8,
      description: 'File data blocks (in-memory string buffer)',
      columns: [
        { name: 'block_id',  type: 'INT',  isPK: true },
        { name: 'inode_id',  type: 'INT',  isFK: true, references: { table: 'InodeTable', column: 'inode_id' } },
        { name: 'data',      type: 'TEXT' },
        { name: 'block_seq', type: 'INT' },
      ],
    },
    {
      id: 'directory_tree',
      name: 'DirectoryTree',
      color: '#00ff88',
      x: 5,
      y: 62,
      description: 'Parent-child directory relationships',
      columns: [
        { name: 'id',        type: 'INT', isPK: true },
        { name: 'parent_id', type: 'INT', isFK: true, isNullable: true, references: { table: 'InodeTable', column: 'inode_id' } },
        { name: 'child_id',  type: 'INT', isFK: true, references: { table: 'InodeTable', column: 'inode_id' } },
      ],
    },
    {
      id: 'memory_blocks',
      name: 'MemoryBlocks',
      color: '#ff9900',
      x: 60,
      y: 62,
      description: 'Block allocator free/used bitmap',
      columns: [
        { name: 'block_id',  type: 'INT',     isPK: true },
        { name: 'is_free',   type: 'BOOLEAN' },
        { name: 'inode_id',  type: 'INT',     isFK: true, isNullable: true, references: { table: 'InodeTable', column: 'inode_id' } },
        { name: 'size',      type: 'INT' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'inode_table',   fromColumn: 'inode_id', toTable: 'file_content',   toColumn: 'inode_id',  type: 'one-to-many', label: 'stores data' },
    { id: 'r2', fromTable: 'inode_table',   fromColumn: 'inode_id', toTable: 'directory_tree', toColumn: 'parent_id', type: 'one-to-many', label: 'parent of' },
    { id: 'r3', fromTable: 'inode_table',   fromColumn: 'inode_id', toTable: 'directory_tree', toColumn: 'child_id',  type: 'one-to-many', label: 'child of' },
    { id: 'r4', fromTable: 'inode_table',   fromColumn: 'inode_id', toTable: 'memory_blocks',  toColumn: 'inode_id',  type: 'one-to-many', label: 'allocated to' },
  ],
}

// ─── Transport System ─────────────────────────────────────────────────────────
const transportSchema: DatabaseSchema = {
  projectId: '4',
  projectSlug: 'transport-system',
  projectTitle: 'Transport System',
  description: 'Django ORM — normalized SQL schema for drivers, vehicles, routes, and assignments',
  tables: [
    {
      id: 'drivers',
      name: 'Drivers',
      color: '#3776ab',
      x: 5,
      y: 5,
      description: 'Driver profiles and license info',
      columns: [
        { name: 'id',             type: 'INT',     isPK: true },
        { name: 'name',           type: 'VARCHAR', length: 100 },
        { name: 'license_no',     type: 'VARCHAR', length: 50 },
        { name: 'license_expiry', type: 'DATETIME' },
        { name: 'status',         type: 'ENUM',    enumValues: ['Available', 'OnDuty', 'OffDuty'] },
        { name: 'phone',          type: 'VARCHAR', length: 20 },
      ],
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      color: '#44b78b',
      x: 60,
      y: 5,
      description: 'Fleet vehicle registry',
      columns: [
        { name: 'id',           type: 'INT',     isPK: true },
        { name: 'plate_no',     type: 'VARCHAR', length: 20 },
        { name: 'model',        type: 'VARCHAR', length: 100 },
        { name: 'capacity',     type: 'INT' },
        { name: 'status',       type: 'ENUM',    enumValues: ['Available', 'InService', 'Maintenance'] },
        { name: 'last_service', type: 'DATETIME', isNullable: true },
      ],
    },
    {
      id: 'routes',
      name: 'Routes',
      color: '#f7df1e',
      x: 5,
      y: 58,
      description: 'Defined transport routes and stops',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'name',        type: 'VARCHAR', length: 100 },
        { name: 'origin',      type: 'VARCHAR', length: 100 },
        { name: 'destination', type: 'VARCHAR', length: 100 },
        { name: 'distance_km', type: 'DECIMAL' },
        { name: 'is_active',   type: 'BOOLEAN' },
      ],
    },
    {
      id: 'assignments',
      name: 'Assignments',
      color: '#dd0031',
      x: 60,
      y: 58,
      description: 'Driver-vehicle-route assignment records',
      columns: [
        { name: 'id',           type: 'INT',     isPK: true },
        { name: 'driver_id',    type: 'INT',     isFK: true, references: { table: 'Drivers', column: 'id' } },
        { name: 'vehicle_id',   type: 'INT',     isFK: true, references: { table: 'Vehicles', column: 'id' } },
        { name: 'route_id',     type: 'INT',     isFK: true, references: { table: 'Routes', column: 'id' } },
        { name: 'scheduled_at', type: 'DATETIME' },
        { name: 'status',       type: 'ENUM',    enumValues: ['Scheduled', 'InProgress', 'Completed', 'Cancelled'] },
      ],
    },
    {
      id: 'schedules',
      name: 'Schedules',
      color: '#ff9900',
      x: 30,
      y: 84,
      description: 'Recurring timetable entries per route',
      columns: [
        { name: 'id',         type: 'INT',     isPK: true },
        { name: 'route_id',   type: 'INT',     isFK: true, references: { table: 'Routes', column: 'id' } },
        { name: 'depart_time',type: 'DATETIME' },
        { name: 'arrive_time',type: 'DATETIME' },
        { name: 'frequency',  type: 'ENUM',    enumValues: ['Daily', 'Weekdays', 'Weekends'] },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'drivers',     fromColumn: 'id',       toTable: 'assignments', toColumn: 'driver_id',  type: 'one-to-many', label: 'assigned to' },
    { id: 'r2', fromTable: 'vehicles',    fromColumn: 'id',       toTable: 'assignments', toColumn: 'vehicle_id', type: 'one-to-many', label: 'used in' },
    { id: 'r3', fromTable: 'routes',      fromColumn: 'id',       toTable: 'assignments', toColumn: 'route_id',   type: 'one-to-many', label: 'assigned on' },
    { id: 'r4', fromTable: 'routes',      fromColumn: 'id',       toTable: 'schedules',   toColumn: 'route_id',   type: 'one-to-many', label: 'scheduled as' },
  ],
}

// ─── Car Rental System ────────────────────────────────────────────────────────
const carRentalSchema: DatabaseSchema = {
  projectId: '5',
  projectSlug: 'car-rental-system',
  projectTitle: 'Car Rental',
  description: 'Java in-memory collections model — cars, customers, rentals, and pricing strategy',
  tables: [
    {
      id: 'cars',
      name: 'Cars',
      color: '#f89820',
      x: 5,
      y: 8,
      description: 'Vehicle inventory (HashMap<String, Car>)',
      columns: [
        { name: 'carId',       type: 'VARCHAR', length: 10, isPK: true },
        { name: 'model',       type: 'VARCHAR', length: 100 },
        { name: 'category',    type: 'ENUM',    enumValues: ['Economy', 'Standard', 'Luxury'] },
        { name: 'isAvailable', type: 'BOOLEAN' },
        { name: 'dailyRate',   type: 'DECIMAL' },
      ],
    },
    {
      id: 'customers',
      name: 'Customers',
      color: '#00d4ff',
      x: 60,
      y: 8,
      description: 'Customer profiles (HashMap<String, Customer>)',
      columns: [
        { name: 'customerId', type: 'VARCHAR', length: 10, isPK: true },
        { name: 'name',       type: 'VARCHAR', length: 100 },
        { name: 'email',      type: 'VARCHAR', length: 150 },
        { name: 'phone',      type: 'VARCHAR', length: 20 },
      ],
    },
    {
      id: 'rentals',
      name: 'Rentals',
      color: '#dd0031',
      x: 5,
      y: 60,
      description: 'Active and historical rental records (ArrayList<Rental>)',
      columns: [
        { name: 'rentalId',   type: 'VARCHAR', length: 10, isPK: true },
        { name: 'carId',      type: 'VARCHAR', length: 10, isFK: true, references: { table: 'Cars', column: 'carId' } },
        { name: 'customerId', type: 'VARCHAR', length: 10, isFK: true, references: { table: 'Customers', column: 'customerId' } },
        { name: 'startDate',  type: 'DATETIME' },
        { name: 'endDate',    type: 'DATETIME', isNullable: true },
        { name: 'totalCost',  type: 'DECIMAL',  isNullable: true },
        { name: 'status',     type: 'ENUM',     enumValues: ['Active', 'Returned', 'Overdue'] },
      ],
    },
    {
      id: 'pricing_rules',
      name: 'PricingRules',
      color: '#7c3aed',
      x: 60,
      y: 60,
      description: 'Strategy pattern rate config per category',
      columns: [
        { name: 'ruleId',      type: 'INT',     isPK: true },
        { name: 'category',    type: 'ENUM',    enumValues: ['Economy', 'Standard', 'Luxury'] },
        { name: 'baseRate',    type: 'DECIMAL' },
        { name: 'weeklyDisc',  type: 'DECIMAL' },
        { name: 'monthlyDisc', type: 'DECIMAL' },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'cars',      fromColumn: 'carId',      toTable: 'rentals',       toColumn: 'carId',      type: 'one-to-many', label: 'rented as' },
    { id: 'r2', fromTable: 'customers', fromColumn: 'customerId', toTable: 'rentals',       toColumn: 'customerId', type: 'one-to-many', label: 'rents' },
    { id: 'r3', fromTable: 'cars',      fromColumn: 'category',   toTable: 'pricing_rules', toColumn: 'category',   type: 'one-to-one',  label: 'priced by' },
  ],
}

// ─── Portfolio ──────────────────────────────────────────────────────────────────
const portfolioSchema: DatabaseSchema = {
  projectId: '10',
  projectSlug: 'portfolio',
  projectTitle: 'Portfolio',
  description: 'Conceptual data model — projects, architecture nodes, DB schemas, skills, and visitor analytics',
  tables: [
    {
      id: 'projects',
      name: 'Projects',
      color: '#00d4ff',
      x: 2,
      y: 3,
      description: 'Core project registry — all portfolio projects',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'slug',        type: 'VARCHAR', length: 80,  isUnique: true },
        { name: 'title',       type: 'VARCHAR', length: 150 },
        { name: 'category',    type: 'ENUM',    enumValues: ['fullstack','frontend','backend','ai-ml'] },
        { name: 'source',      type: 'ENUM',    enumValues: ['personal','internship'] },
        { name: 'status',      type: 'ENUM',    enumValues: ['completed','in-progress','archived'] },
        { name: 'featured',    type: 'BOOLEAN', defaultValue: 'false' },
        { name: 'year',        type: 'INT' },
      ],
    },
    {
      id: 'tech_stack',
      name: 'TechStack',
      color: '#7c3aed',
      x: 56,
      y: 3,
      description: 'Technologies used per project',
      columns: [
        { name: 'id',         type: 'INT',     isPK: true },
        { name: 'project_id', type: 'INT',     isFK: true, references: { table: 'Projects', column: 'id' } },
        { name: 'name',       type: 'VARCHAR', length: 80 },
        { name: 'color',      type: 'VARCHAR', length: 10 },
        { name: 'sort_order', type: 'INT',     defaultValue: '0' },
      ],
    },
    {
      id: 'arch_nodes',
      name: 'ArchNodes',
      color: '#ff9900',
      x: 2,
      y: 48,
      description: 'Architecture diagram nodes per project level',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'project_id',  type: 'INT',     isFK: true, references: { table: 'Projects', column: 'id' } },
        { name: 'level',       type: 'ENUM',    enumValues: ['overview','service','detail'] },
        { name: 'node_key',    type: 'VARCHAR', length: 50 },
        { name: 'label',       type: 'VARCHAR', length: 100 },
        { name: 'type',        type: 'VARCHAR', length: 30 },
        { name: 'color',       type: 'VARCHAR', length: 10 },
        { name: 'x_pct',       type: 'DECIMAL' },
        { name: 'y_pct',       type: 'DECIMAL' },
      ],
    },
    {
      id: 'db_tables',
      name: 'DBTables',
      color: '#00ff88',
      x: 56,
      y: 48,
      description: 'Database schema tables per project',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'project_id',  type: 'INT',     isFK: true, references: { table: 'Projects', column: 'id' } },
        { name: 'table_key',   type: 'VARCHAR', length: 60 },
        { name: 'name',        type: 'VARCHAR', length: 80 },
        { name: 'color',       type: 'VARCHAR', length: 10 },
        { name: 'description', type: 'TEXT',    isNullable: true },
      ],
    },
    {
      id: 'skills',
      name: 'Skills',
      color: '#dd0031',
      x: 2,
      y: 80,
      description: 'Skill definitions with category and proficiency',
      columns: [
        { name: 'id',       type: 'INT',     isPK: true },
        { name: 'name',     type: 'VARCHAR', length: 80 },
        { name: 'category', type: 'ENUM',    enumValues: ['frontend','backend','database','cloud','devops','ai-ml'] },
        { name: 'level',    type: 'INT' },
        { name: 'color',    type: 'VARCHAR', length: 10 },
      ],
    },
    {
      id: 'visitors',
      name: 'Visitors',
      color: '#a78bfa',
      x: 56,
      y: 80,
      description: 'Anonymous visitor analytics via serverless API',
      columns: [
        { name: 'id',          type: 'INT',     isPK: true },
        { name: 'ip_hash',     type: 'VARCHAR', length: 64, isUnique: true },
        { name: 'country',     type: 'VARCHAR', length: 50, isNullable: true, isIndex: true },
        { name: 'visited_at',  type: 'DATETIME', defaultValue: 'NOW()' },
        { name: 'page',        type: 'VARCHAR', length: 100 },
      ],
    },
  ],
  relationships: [
    { id: 'r1', fromTable: 'projects',   fromColumn: 'id',         toTable: 'tech_stack', toColumn: 'project_id', type: 'one-to-many', label: 'uses' },
    { id: 'r2', fromTable: 'projects',   fromColumn: 'id',         toTable: 'arch_nodes', toColumn: 'project_id', type: 'one-to-many', label: 'has nodes' },
    { id: 'r3', fromTable: 'projects',   fromColumn: 'id',         toTable: 'db_tables',  toColumn: 'project_id', type: 'one-to-many', label: 'has schema' },
  ],
}

export const databaseSchemas: DatabaseSchema[] = [
  teslaAcademySchema,
  fitClubSchema,
  cvfsSchema,
  transportSchema,
  carRentalSchema,
  bookNowSchema,
  propertyRegistrySchema,
  ticketPlatformSchema,
  dashboardSchema,
  portfolioSchema,
]

export function getSchemaBySlug(slug: string): DatabaseSchema | undefined {
  return databaseSchemas.find((s) => s.projectSlug === slug)
}
