import { 
  pgTable, 
  serial, 
  text, 
  timestamp,
  uniqueIndex 
} from 'drizzle-orm/pg-core';

// Example user table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
}, (users) => ({
  uniqueEmailIdx: uniqueIndex('unique_email_idx').on(users.email)
}));
