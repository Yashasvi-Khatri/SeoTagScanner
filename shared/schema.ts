import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const seoResults = pgTable("seo_results", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  score: integer("score"),
  analysis_data: text("analysis_data"),
  created_at: text("created_at").notNull(),
});

export const insertSeoResultSchema = createInsertSchema(seoResults).pick({
  url: true,
  title: true,
  description: true,
  score: true,
  analysis_data: true,
  created_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSeoResult = z.infer<typeof insertSeoResultSchema>;
export type SeoResult = typeof seoResults.$inferSelect;
