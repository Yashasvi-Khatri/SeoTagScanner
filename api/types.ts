export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
  created_at: string;
}

export interface ScanResult {
  id: string;
  user_id: string;
  url: string;
  result: any;
  scanned_at: string;
}

export interface ScanHistory {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  created_at: string;
}
