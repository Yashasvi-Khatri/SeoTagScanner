import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const seoAnalysis = pgTable("seo_analysis", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  domain: text("domain").notNull(),
  title: text("title"),
  description: text("description"),
  score: integer("score").notNull(),
  essentialTagsFound: integer("essential_tags_found").notNull(),
  essentialTagsTotal: integer("essential_tags_total").notNull(),
  socialTagsFound: integer("social_tags_found").notNull(),
  socialTagsTotal: integer("social_tags_total").notNull(),
  structuredDataFound: integer("structured_data_found").notNull(),
  structuredDataTotal: integer("structured_data_total").notNull(),
  createdAt: text("created_at").notNull(),
  data: jsonb("data").notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalysis).omit({
  id: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalysis.$inferSelect;
