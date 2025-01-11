export interface Session {
  status: 'loading' | 'authenticated' | 'unauthenticated';
}
export interface Maintenance {
  onMaintenance: boolean;
}
