// Local database for user authentication
// In a real app, this would be a backend API with hashed passwords
export interface User {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarColor?: string; // gradient name
  joinedAt?: string;
}

// Default users "database"
const defaultUsers: User[] = [
  { username: "admin", password: "admin123", fullName: "Administrator", email: "admin@cihbank.ma", phone: "+212 600 000 001", bio: "System administrator.", avatarColor: "blue", joinedAt: "2023-01-15" },
  { username: "user", password: "user123", fullName: "CIH User", email: "user@cihbank.ma", phone: "+212 600 000 002", bio: "Demo user account.", avatarColor: "emerald", joinedAt: "2024-06-10" },
  { username: "mohamed", password: "1234", fullName: "Mohamed El Amrani", email: "mohamed@cihbank.ma", phone: "+212 661 234 567", bio: "Love saving money & smart budgeting!", avatarColor: "orange", joinedAt: "2024-09-22" },
];

const DB_KEY = "cih_bank_users_db";

// Initialize database in localStorage
function initDB(): void {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers));
  }
}

// Get all users from database
function getUsers(): User[] {
  initDB();
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
}

// Authenticate user
export function authenticateUser(
  username: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (user) {
    return { success: true, user };
  }
  return { success: false, error: "Invalid username or password" };
}

// Register a new user
export function registerUser(
  username: string,
  password: string,
  fullName: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const exists = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    return { success: false, error: "Username already exists" };
  }

  users.push({
    username,
    password,
    fullName,
    email: "",
    phone: "",
    bio: "",
    avatarColor: "blue",
    joinedAt: new Date().toISOString().slice(0, 10),
  });
  localStorage.setItem(DB_KEY, JSON.stringify(users));
  return { success: true };
}

// Update user profile
export function updateUserProfile(
  username: string,
  updates: Partial<Omit<User, "username">>
): { success: boolean; user?: User; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return { success: false, error: "User not found" };
  users[idx] = { ...users[idx], ...updates };
  localStorage.setItem(DB_KEY, JSON.stringify(users));
  // sync session
  const sess = getSession();
  if (sess && sess.username.toLowerCase() === username.toLowerCase()) {
    setSession(users[idx]);
  }
  return { success: true, user: users[idx] };
}

// Verify current password (for sensitive actions)
export function verifyPassword(username: string, password: string): boolean {
  const users = getUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  return !!user && user.password === password;
}

// Session management
const SESSION_KEY = "cih_bank_session";

export function setSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// User-specific data storage (cards, family, workers, etc.)
const USER_DATA_KEY = "cih_bank_user_data";

export interface UserData {
  cards?: any[];
  generalMoney?: number;
  familyMembers?: any[];
  workers?: any[];
}

export function getUserData(username: string): UserData {
  const allData = localStorage.getItem(USER_DATA_KEY);
  if (!allData) return {};
  const parsed = JSON.parse(allData);
  return parsed[username] || {};
}

export function saveUserData(username: string, data: Partial<UserData>): void {
  const allData = localStorage.getItem(USER_DATA_KEY);
  const parsed = allData ? JSON.parse(allData) : {};
  parsed[username] = { ...parsed[username], ...data };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(parsed));
}
