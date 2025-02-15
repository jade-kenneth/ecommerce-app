export interface Session {
  status: 'authenticated' | 'unauthenticated';
}
export interface Maintenance {
  onMaintenance: boolean;
}
