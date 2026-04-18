// Local database for user authentication
// In a real app, this would be a backend API with hashed passwords
export interface User {
  username: string;
  password: string;
  fullName: string;
}

// Default users "database"
const defaultUsers: User[] = [
  { username: "admin", password: "admin123", fullName: "Administrator" },
  { username: "user", password: "user123", fullName: "CIH User" },
  { username: "mohamed", password: "1234", fullName: "Mohamed El Amrani" },
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

  users.push({ username, password, fullName });
  localStorage.setItem(DB_KEY, JSON.stringify(users));
  return { success: true };
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
