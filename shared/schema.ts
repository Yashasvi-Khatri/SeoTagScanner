import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const seoResults = pgTable("seo_results", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  score: integer("score"),
  analysis_data: text("analysis_data"),
  created_at: text("created_at").notNull(),
});

export const insertSeoResultSchema = createInsertSchema(seoResults).pick({
  user_id: true,
  url: true,
  title: true,
  description: true,
  score: true,
  analysis_data: true,
  created_at: true,
});

export const dailyScanCounts = pgTable("daily_scan_counts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  scan_date: text("scan_date").notNull(),
  count: integer("count").notNull().default(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSeoResult = z.infer<typeof insertSeoResultSchema>;
export type SeoResult = typeof seoResults.$inferSelect;
export type DailyScanCount = typeof dailyScanCounts.$inferSelect;
