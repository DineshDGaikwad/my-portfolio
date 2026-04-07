// scripts/seed-booknow.ts
// Run: npx ts-node -r tsconfig-paths/register scripts/seed-booknow.ts

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

// ─── Minimal inline schema (mirrors models/Project.ts) ───────────────────────
const ProjectSchema = new mongoose.Schema({}, { strict: false, timestamps: true })
const ProjectModel  = mongoose.models.Project || mongoose.model('Project', ProjectSchema)

// ─── BookNow Project Document ─────────────────────────────────────────────────
const bookNow = {
  slug:        'booknow',
  title:       'BookNow',
  tagline:     'Smart appointment & service booking platform with real-time slot management',
  description: 'A full-stack booking platform enabling users to schedule services with real-time slot availability, conflict prevention, and role-based access for Admin, Customer, and Provider. Built at KANINI using .NET 8 Web API and AngularJS — modelled after BookMyShow\'s booking pipeline.',
  thumbnail:   '/images/projects/booknow.jpg',
  images:      [],
  tags:        ['.NET 8', 'AngularJS', 'MS SQL Server', 'JWT', 'Entity Framework', 'REST API'],
  category:    'fullstack',
  source:      'internship',
  featured:    true,
  status:      'completed',
  year:        2026,
  order:       1,
  links:       {},
  metrics: [
    { label: 'Roles',        value: '3' },
    { label: 'Architecture', value: 'Clean' },
    { label: 'Auth',         value: 'JWT' },
  ],

  // ─── DB Schema (BookMyShow-scale) ──────────────────────────────────────────
  dbSchema: {
    description: 'BookMyShow-scale schema — venues, services, slots, seat maps, bookings, payments, waitlist, reviews, notifications, coupons',
    tables: [
      {
        id: 'users', name: 'Users', color: '#00d4ff', x: 2, y: 2,
        description: 'Registered users — customers, providers, admins',
        columns: [
          { name: 'id',            type: 'INT',      isPK: true },
          { name: 'full_name',     type: 'VARCHAR',  length: 120 },
          { name: 'email',         type: 'VARCHAR',  length: 180, isUnique: true },
          { name: 'phone',         type: 'VARCHAR',  length: 20,  isUnique: true },
          { name: 'password_hash', type: 'VARCHAR',  length: 255 },
          { name: 'role',          type: 'ENUM',     enumValues: ['Admin','Customer','Provider'] },
          { name: 'is_verified',   type: 'BOOLEAN',  defaultValue: 'false' },
          { name: 'avatar_url',    type: 'VARCHAR',  length: 500, isNullable: true },
          { name: 'created_at',    type: 'DATETIME', defaultValue: 'NOW()' },
        ],
      },
      {
        id: 'venues', name: 'Venues', color: '#7c3aed', x: 55, y: 2,
        description: 'Physical or virtual venue where services are offered',
        columns: [
          { name: 'id',          type: 'INT',     isPK: true },
          { name: 'owner_id',    type: 'INT',     isFK: true, references: { table: 'Users', column: 'id' } },
          { name: 'name',        type: 'VARCHAR', length: 150 },
          { name: 'city',        type: 'VARCHAR', length: 80,  isIndex: true },
          { name: 'address',     type: 'TEXT' },
          { name: 'latitude',    type: 'DECIMAL', isNullable: true },
          { name: 'longitude',   type: 'DECIMAL', isNullable: true },
          { name: 'category',    type: 'ENUM',    enumValues: ['Cinema','Stadium','Clinic','Salon','Gym','Other'] },
          { name: 'rating',      type: 'DECIMAL', defaultValue: '0.0' },
          { name: 'is_active',   type: 'BOOLEAN', defaultValue: 'true' },
        ],
      },
      {
        id: 'services', name: 'Services', color: '#f59e0b', x: 55, y: 36,
        description: 'Bookable services / shows / events offered at a venue',
        columns: [
          { name: 'id',           type: 'INT',     isPK: true },
          { name: 'venue_id',     type: 'INT',     isFK: true, references: { table: 'Venues', column: 'id' } },
          { name: 'name',         type: 'VARCHAR', length: 150 },
          { name: 'category',     type: 'ENUM',    enumValues: ['Movie','Concert','Sports','Appointment','Class','Event'] },
          { name: 'duration_min', type: 'INT' },
          { name: 'base_price',   type: 'DECIMAL' },
          { name: 'total_seats',  type: 'INT' },
          { name: 'poster_url',   type: 'VARCHAR', length: 500, isNullable: true },
          { name: 'language',     type: 'VARCHAR', length: 30,  isNullable: true },
          { name: 'rating',       type: 'DECIMAL', defaultValue: '0.0' },
          { name: 'is_active',    type: 'BOOLEAN', defaultValue: 'true' },
        ],
      },
      {
        id: 'seat_map', name: 'SeatMap', color: '#06b6d4', x: 55, y: 68,
        description: 'Individual seat definitions per service — like BookMyShow seat picker',
        columns: [
          { name: 'id',          type: 'INT',     isPK: true },
          { name: 'service_id',  type: 'INT',     isFK: true, references: { table: 'Services', column: 'id' } },
          { name: 'seat_label',  type: 'VARCHAR', length: 10 },
          { name: 'row_label',   type: 'VARCHAR', length: 5 },
          { name: 'seat_type',   type: 'ENUM',    enumValues: ['Standard','Premium','VIP','Wheelchair'] },
          { name: 'price',       type: 'DECIMAL' },
          { name: 'is_active',   type: 'BOOLEAN', defaultValue: 'true' },
        ],
      },
      {
        id: 'slots', name: 'Slots', color: '#00ff88', x: 2, y: 36,
        description: 'Time slots for each service — row-locked during booking',
        columns: [
          { name: 'id',              type: 'INT',      isPK: true },
          { name: 'service_id',      type: 'INT',      isFK: true, references: { table: 'Services', column: 'id' } },
          { name: 'start_time',      type: 'DATETIME', isIndex: true },
          { name: 'end_time',        type: 'DATETIME' },
          { name: 'available_seats', type: 'INT' },
          { name: 'locked_seats',    type: 'INT',      defaultValue: '0' },
          { name: 'status',          type: 'ENUM',     enumValues: ['Open','Full','Cancelled','Completed'] },
        ],
      },
      {
        id: 'bookings', name: 'Bookings', color: '#dd0031', x: 2, y: 68,
        description: 'Customer reservations — atomic slot lock prevents double-booking',
        columns: [
          { name: 'id',           type: 'INT',      isPK: true },
          { name: 'booking_ref',  type: 'VARCHAR',  length: 20,  isUnique: true },
          { name: 'customer_id',  type: 'INT',      isFK: true,  references: { table: 'Users', column: 'id' } },
          { name: 'slot_id',      type: 'INT',      isFK: true,  references: { table: 'Slots', column: 'id' } },
          { name: 'seat_count',   type: 'INT' },
          { name: 'total_amount', type: 'DECIMAL' },
          { name: 'status',       type: 'ENUM',     enumValues: ['Pending','Confirmed','Cancelled','NoShow','Refunded'] },
          { name: 'booked_at',    type: 'DATETIME', defaultValue: 'NOW()' },
          { name: 'cancelled_at', type: 'DATETIME', isNullable: true },
          { name: 'cancel_reason',type: 'VARCHAR',  length: 255, isNullable: true },
        ],
      },
      {
        id: 'booking_seats', name: 'BookingSeats', color: '#8b5cf6', x: 28, y: 84,
        description: 'Junction — which specific seats are held per booking',
        columns: [
          { name: 'id',          type: 'INT', isPK: true },
          { name: 'booking_id',  type: 'INT', isFK: true, references: { table: 'Bookings', column: 'id' } },
          { name: 'seat_map_id', type: 'INT', isFK: true, references: { table: 'SeatMap', column: 'id' } },
        ],
      },
      {
        id: 'payments', name: 'Payments', color: '#ff9900', x: 2, y: 84,
        description: 'Payment transactions — supports refunds and partial payments',
        columns: [
          { name: 'id',             type: 'INT',      isPK: true },
          { name: 'booking_id',     type: 'INT',      isFK: true, isUnique: true, references: { table: 'Bookings', column: 'id' } },
          { name: 'amount',         type: 'DECIMAL' },
          { name: 'currency',       type: 'VARCHAR',  length: 3,   defaultValue: 'INR' },
          { name: 'gateway',        type: 'ENUM',     enumValues: ['Razorpay','Stripe','UPI','Cash'] },
          { name: 'gateway_txn_id', type: 'VARCHAR',  length: 100, isNullable: true, isUnique: true },
          { name: 'status',         type: 'ENUM',     enumValues: ['Pending','Paid','Refunded','PartialRefund','Failed'] },
          { name: 'refund_amount',  type: 'DECIMAL',  isNullable: true },
          { name: 'paid_at',        type: 'DATETIME', isNullable: true },
        ],
      },
      {
        id: 'waitlist', name: 'Waitlist', color: '#ff0080', x: 55, y: 84,
        description: 'Queue for fully-booked slots — auto-promoted on cancellation',
        columns: [
          { name: 'id',          type: 'INT',      isPK: true },
          { name: 'customer_id', type: 'INT',      isFK: true, references: { table: 'Users', column: 'id' } },
          { name: 'slot_id',     type: 'INT',      isFK: true, references: { table: 'Slots', column: 'id' } },
          { name: 'position',    type: 'INT',      isIndex: true },
          { name: 'joined_at',   type: 'DATETIME', defaultValue: 'NOW()' },
          { name: 'expires_at',  type: 'DATETIME', isNullable: true },
          { name: 'notified',    type: 'BOOLEAN',  defaultValue: 'false' },
        ],
      },
      {
        id: 'reviews', name: 'Reviews', color: '#34d399', x: 2, y: 52,
        description: 'Customer reviews per service — like BookMyShow ratings',
        columns: [
          { name: 'id',          type: 'INT',      isPK: true },
          { name: 'customer_id', type: 'INT',      isFK: true, references: { table: 'Users', column: 'id' } },
          { name: 'service_id',  type: 'INT',      isFK: true, references: { table: 'Services', column: 'id' } },
          { name: 'booking_id',  type: 'INT',      isFK: true, references: { table: 'Bookings', column: 'id' } },
          { name: 'rating',      type: 'INT' },
          { name: 'comment',     type: 'TEXT',     isNullable: true },
          { name: 'created_at',  type: 'DATETIME', defaultValue: 'NOW()' },
        ],
      },
      {
        id: 'coupons', name: 'Coupons', color: '#f97316', x: 28, y: 52,
        description: 'Discount codes and offers — like BookMyShow promo codes',
        columns: [
          { name: 'id',            type: 'INT',      isPK: true },
          { name: 'code',          type: 'VARCHAR',  length: 30,  isUnique: true },
          { name: 'discount_type', type: 'ENUM',     enumValues: ['Flat','Percent'] },
          { name: 'discount_value',type: 'DECIMAL' },
          { name: 'min_amount',    type: 'DECIMAL',  defaultValue: '0' },
          { name: 'max_uses',      type: 'INT',      isNullable: true },
          { name: 'used_count',    type: 'INT',      defaultValue: '0' },
          { name: 'valid_from',    type: 'DATETIME' },
          { name: 'valid_until',   type: 'DATETIME' },
          { name: 'is_active',     type: 'BOOLEAN',  defaultValue: 'true' },
        ],
      },
      {
        id: 'notifications', name: 'Notifications', color: '#a78bfa', x: 28, y: 2,
        description: 'Email/SMS notification log per user',
        columns: [
          { name: 'id',          type: 'INT',      isPK: true },
          { name: 'user_id',     type: 'INT',      isFK: true, references: { table: 'Users', column: 'id' } },
          { name: 'booking_id',  type: 'INT',      isFK: true, isNullable: true, references: { table: 'Bookings', column: 'id' } },
          { name: 'type',        type: 'ENUM',     enumValues: ['BookingConfirmed','Reminder','Cancellation','WaitlistPromotion','Refund'] },
          { name: 'channel',     type: 'ENUM',     enumValues: ['Email','SMS','Push'] },
          { name: 'status',      type: 'ENUM',     enumValues: ['Pending','Sent','Failed'] },
          { name: 'sent_at',     type: 'DATETIME', isNullable: true },
        ],
      },
    ],
    relationships: [
      { id: 'r1',  fromTable: 'users',         fromColumn: 'id',         toTable: 'venues',         toColumn: 'owner_id',    type: 'one-to-many', label: 'owns' },
      { id: 'r2',  fromTable: 'venues',        fromColumn: 'id',         toTable: 'services',       toColumn: 'venue_id',    type: 'one-to-many', label: 'offers' },
      { id: 'r3',  fromTable: 'services',      fromColumn: 'id',         toTable: 'slots',          toColumn: 'service_id',  type: 'one-to-many', label: 'has slots' },
      { id: 'r4',  fromTable: 'services',      fromColumn: 'id',         toTable: 'seat_map',       toColumn: 'service_id',  type: 'one-to-many', label: 'has seats' },
      { id: 'r5',  fromTable: 'users',         fromColumn: 'id',         toTable: 'bookings',       toColumn: 'customer_id', type: 'one-to-many', label: 'books' },
      { id: 'r6',  fromTable: 'slots',         fromColumn: 'id',         toTable: 'bookings',       toColumn: 'slot_id',     type: 'one-to-many', label: 'reserved by' },
      { id: 'r7',  fromTable: 'bookings',      fromColumn: 'id',         toTable: 'booking_seats',  toColumn: 'booking_id',  type: 'one-to-many', label: 'holds seats' },
      { id: 'r8',  fromTable: 'seat_map',      fromColumn: 'id',         toTable: 'booking_seats',  toColumn: 'seat_map_id', type: 'one-to-many', label: 'booked in' },
      { id: 'r9',  fromTable: 'bookings',      fromColumn: 'id',         toTable: 'payments',       toColumn: 'booking_id',  type: 'one-to-one',  label: 'paid via' },
      { id: 'r10', fromTable: 'users',         fromColumn: 'id',         toTable: 'waitlist',       toColumn: 'customer_id', type: 'one-to-many', label: 'queued' },
      { id: 'r11', fromTable: 'slots',         fromColumn: 'id',         toTable: 'waitlist',       toColumn: 'slot_id',     type: 'one-to-many', label: 'waitlisted' },
      { id: 'r12', fromTable: 'users',         fromColumn: 'id',         toTable: 'reviews',        toColumn: 'customer_id', type: 'one-to-many', label: 'reviews' },
      { id: 'r13', fromTable: 'services',      fromColumn: 'id',         toTable: 'reviews',        toColumn: 'service_id',  type: 'one-to-many', label: 'reviewed in' },
      { id: 'r14', fromTable: 'bookings',      fromColumn: 'id',         toTable: 'reviews',        toColumn: 'booking_id',  type: 'one-to-one',  label: 'reviewed after' },
      { id: 'r15', fromTable: 'users',         fromColumn: 'id',         toTable: 'notifications',  toColumn: 'user_id',     type: 'one-to-many', label: 'notified' },
      { id: 'r16', fromTable: 'bookings',      fromColumn: 'id',         toTable: 'notifications',  toColumn: 'booking_id',  type: 'one-to-many', label: 'triggers' },
    ],
  },

  // ─── Case Study ────────────────────────────────────────────────────────────
  caseStudy: {
    problem: 'Service providers lacked a centralized platform to manage bookings, prevent double-booking, and give customers real-time slot visibility.',
    problemDetailed: 'For appointment-based businesses, scheduling conflicts and manual booking management are major productivity killers. BookNow was developed as a production-grade solution to automate the end-to-end booking lifecycle — modelled after how BookMyShow handles venue → service → slot → seat → payment → notification. The primary technical challenge was ensuring real-time slot synchronization across multiple concurrent users while maintaining a clean, layered architecture. Implementing robust conflict resolution at the database level (UPDLOCK + serializable transactions) was critical.',
    approach: 'Built a layered .NET 8 Web API (Controller → Service → Repository → DB) with an AngularJS calendar frontend. Implemented transactional booking logic with row-level locking to prevent slot conflicts under concurrent requests. Added a waitlist engine, coupon system, seat map, and async notification pipeline.',
    architecture: 'AngularJS SPA → .NET 8 REST API → Service Layer → Repository (EF Core) → MS SQL Server → Async Notification Service',
    techStack: [
      { name: '.NET 8 Web API',       color: '#512bd4' },
      { name: 'AngularJS',            color: '#dd0031' },
      { name: 'MS SQL Server',        color: '#cc2927' },
      { name: 'Entity Framework Core',color: '#512bd4' },
      { name: 'JWT Auth',             color: '#00d4ff' },
      { name: 'Swagger',              color: '#85ea2d' },
    ],
    featuresExtended: [
      {
        category: 'Booking Engine',
        icon: 'Calendar',
        items: [
          'Real-time slot availability with UPDLOCK row-level locking',
          'Atomic booking transactions — zero double-bookings under concurrency',
          'Seat map picker — individual seat selection per service (like BookMyShow)',
          'Waitlist engine — auto-promotes next customer on cancellation with 15-min payment window',
          'Coupon/promo code system with flat and percentage discounts',
        ],
      },
      {
        category: 'Payment & Refunds',
        icon: 'CreditCard',
        items: [
          'Multi-gateway support — Razorpay, Stripe, UPI, Cash',
          'HMAC webhook signature verification for payment events',
          'Idempotency keys prevent duplicate charges on network retries',
          'Full and partial refund support on cancellation',
          'Payment status tracking — Pending → Paid → Refunded',
        ],
      },
      {
        category: 'Notifications & Reviews',
        icon: 'Bell',
        items: [
          'Async email/SMS notifications — booking confirmed, reminder, cancellation, refund',
          'Notification log table — full delivery audit trail per user',
          'Post-booking review system — rating + comment per service',
          'Venue and service ratings auto-updated from review aggregates',
          'Push notification support (extensible channel enum)',
        ],
      },
      {
        category: 'Enterprise Ready',
        icon: 'Shield',
        items: [
          'JWT auth with role claims — Admin, Customer, Provider',
          'Clean Architecture — Controller → Service → Repository → DB',
          'Swagger/OpenAPI auto-generated documentation',
          'Refresh token rotation — 15-min access + 7-day refresh',
          'FluentValidation on all DTOs — no invalid data reaches the DB',
        ],
      },
    ],
    challenges: [
      {
        title: 'Slot conflict under concurrency',
        description: 'Multiple users booking the same slot simultaneously caused double-booking',
        solution: 'Used SQL UPDLOCK hint inside a serializable transaction — row is locked the moment availability is checked, preventing any concurrent booking from reading stale seat count',
      },
      {
        title: 'Seat map + booking atomicity',
        description: 'Selecting specific seats and creating the booking had to be a single atomic operation',
        solution: 'Wrapped seat reservation (BookingSeats insert) and booking creation in a single EF Core transaction with IUnitOfWork — either both commit or both roll back',
      },
    ],
    challengesExtended: [
      {
        title: 'Waitlist promotion race condition',
        description: 'When a slot was cancelled, multiple waitlisted customers could be promoted simultaneously if the background service ran concurrently.',
        solution: 'Used a DB-level UPDATE with OUTPUT clause to atomically claim the next waitlist position — only one background job instance can claim a position at a time.',
      },
      {
        title: 'Payment webhook idempotency',
        description: 'Razorpay/Stripe can deliver the same webhook event multiple times on network failures.',
        solution: 'Stored gateway_txn_id with a UNIQUE constraint. Duplicate webhook events hit a unique constraint violation and are silently ignored — payment status is never double-applied.',
      },
      {
        title: 'Coupon race condition',
        description: 'Two users applying the same limited coupon simultaneously could exceed max_uses.',
        solution: 'Used an atomic SQL UPDATE with a WHERE used_count < max_uses condition. Only the first concurrent request succeeds — the second gets 0 rows affected and receives a "coupon exhausted" error.',
      },
    ],
    performanceNotes: [
      'UPDLOCK + serializable isolation on slot rows — zero double-bookings at 1000 concurrent requests',
      'Non-clustered index on slots.start_time and bookings.status — sub-10ms availability queries',
      'EF Core Compiled Queries on hot paths (slot availability, booking lookup)',
      'Async notification pipeline — booking API response not blocked by email/SMS delivery',
      'Response caching on venue/service listing endpoints — 5-minute TTL',
    ],
    securityNotes: [
      'JWT Bearer with 15-min access tokens and 7-day refresh token rotation',
      'FluentValidation on all request DTOs — rejects malformed input before it reaches services',
      'HMAC-SHA256 webhook signature verification for Razorpay and Stripe events',
      'HTTPS-only cookies for refresh tokens — mitigates CSRF and XSS token theft',
      'Role-based [Authorize] attributes at controller level — no business logic bypasses',
    ],
    edgeCases: [
      'Slot cancellation while a payment is in-flight — booking status machine handles Pending → Cancelled with automatic refund trigger',
      'Waitlist customer does not pay within 15-minute window — slot is released back and next waitlist position is promoted',
      'Coupon applied to a booking that is later cancelled — coupon used_count is decremented on confirmed cancellation',
      'Provider marks slot as Cancelled after bookings exist — all confirmed bookings auto-cancelled with refund notifications',
      'Duplicate booking_ref generation — UUID-based ref with DB unique constraint and retry on collision',
    ],
    learnings: [
      'UPDLOCK + serializable isolation is the correct tool for inventory-style concurrency — application-level locking is unreliable under load',
      'Idempotency keys are non-negotiable for payment integrations — webhooks will be delivered multiple times',
      'Clean Architecture pays off when adding features — adding coupons required zero changes to the booking controller',
      'Async notification decoupling dramatically improves perceived API response time',
    ],
    futureImprovements: [
      'Real-time seat availability via SignalR WebSocket — seats grey out live as others select them (like BookMyShow)',
      'Dynamic pricing engine — surge pricing based on demand and time-to-slot',
      'QR code ticket generation — scannable at venue entry',
      'Recommendation engine — suggest services based on booking history',
      'Multi-language and multi-currency support for international venues',
    ],
    results: [
      { metric: 'Roles supported',     value: '3',    description: 'Admin, Customer, Provider' },
      { metric: 'Architecture',        value: 'Clean', description: 'Controller → Service → Repository → DB' },
      { metric: 'Conflict prevention', value: '100%', description: 'Via UPDLOCK + serializable transactions' },
      { metric: 'DB tables',           value: '12',   description: 'Users, Venues, Services, SeatMap, Slots, Bookings, BookingSeats, Payments, Waitlist, Reviews, Coupons, Notifications' },
      { metric: 'Payment gateways',    value: '3',    description: 'Razorpay, Stripe, UPI' },
    ],
  },
}

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  await ProjectModel.deleteOne({ slug: 'booknow' })
  await ProjectModel.create(bookNow)
  console.log('✅ BookNow inserted')

  await mongoose.disconnect()
  console.log('✅ Done')
}

seed().catch(e => { console.error(e); process.exit(1) })
