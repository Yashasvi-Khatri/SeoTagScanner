import { seoResults, type SeoResult, type InsertSeoResult, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSeoResult(result: InsertSeoResult): Promise<SeoResult>;
  getSeoResult(id: number): Promise<SeoResult | undefined>;
  getSeoResultByUrl(url: string): Promise<SeoResult | undefined>;
  getRecentSeoResults(limit: number): Promise<SeoResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seoResults: Map<number, SeoResult>;
  private userCurrentId: number;
  private seoResultCurrentId: number;

  constructor() {
    this.users = new Map();
    this.seoResults = new Map();
    this.userCurrentId = 1;
    this.seoResultCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSeoResult(insertSeoResult: InsertSeoResult): Promise<SeoResult> {
    const id = this.seoResultCurrentId++;
    // Create a valid SeoResult object with required fields
    const seoResult = {
      id,
      url: insertSeoResult.url,
      title: insertSeoResult.title ?? null,
      description: insertSeoResult.description ?? null,
      score: insertSeoResult.score ?? null,
      analysis_data: insertSeoResult.analysis_data ?? null,
      created_at: insertSeoResult.created_at
    } as SeoResult;
    
    this.seoResults.set(id, seoResult);
    return seoResult;
  }

  async getSeoResult(id: number): Promise<SeoResult | undefined> {
    return this.seoResults.get(id);
  }

  async getSeoResultByUrl(url: string): Promise<SeoResult | undefined> {
    return Array.from(this.seoResults.values()).find(
      (result) => result.url === url
    );
  }

  async getRecentSeoResults(limit: number): Promise<SeoResult[]> {
    const results = Array.from(this.seoResults.values());
    // Sort by most recent first
    results.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
    return results.slice(0, limit);
  }
}

export const storage = new MemStorage();
