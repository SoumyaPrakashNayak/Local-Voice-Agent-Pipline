export interface NavItem {
  label: string;
  path: string;
  href: string;
  icon: string;
  badge?: number | string;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Cases', path: '/cases', href: '/cases', icon: 'folder-open', badge: 12 },
  { label: 'Register FIR', path: '/cases/new', href: '/cases/new', icon: 'file-plus' },
  { label: 'Network Explorer', path: '/network', href: '/network', icon: 'network' },
  { label: 'Evidence Vault', path: '/evidence', href: '/evidence', icon: 'sparkles' },
  { label: 'Legal Intelligence', path: '/legal', href: '/legal', icon: 'scale' },
  { label: 'Analytics', path: '/reports', href: '/reports', icon: 'bar-chart-3' },
  { label: 'Stations', path: '/stations', href: '/stations', icon: 'map' },
  { label: 'Investigators', path: '/investigators', href: '/investigators', icon: 'users' },
  { label: 'Access Requests', path: '/requests', href: '/requests', icon: 'file-bar-chart', badge: 3 },
];

export const currentUser = {
  name: 'SI Ranjan Samal',
  badge: 'OD-INV-001',
  role: 'OFFICER',
  station: 'Khandagiri Police Station',
  email: 'ranjan.samal@odishapolice.gov.in',
  avatar: '',
};

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
  href: string;
}

export const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Cross-Station Match Detected',
    message: 'Vehicle OD-02-AB-1234 linked to Cuttack PS case.',
    time: '5m ago',
    read: false,
    type: 'alert',
    href: '/network',
  },
  {
    id: '2',
    title: 'Access Request Approved',
    message: 'Dossier OD-CTC-2026-00981 unlocked.',
    time: '1h ago',
    read: true,
    type: 'info',
    href: '/requests',
  },
];
