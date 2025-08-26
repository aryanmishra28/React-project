// This API service has been simplified and moved to AuthContext.tsx
// Keeping this file as a placeholder to prevent import errors
export class ApiService {
  static async getCurrentUser() {
    return null;
  }
  
  static async signup(email: string, password: string, name: string) {
    console.log('Mock signup:', email, name);
  }
  
  static async signIn(email: string, password: string) {
    console.log('Mock signin:', email);
    return { user: { email, user_metadata: { name: 'Test User' } } };
  }
  
  static async signOut() {
    console.log('Mock signout');
  }
}