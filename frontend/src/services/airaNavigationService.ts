import { NavigateFunction } from 'react-router-dom';

/**
 * Centrally maps AIRA intelligence intents and routes into actual platform paths
 * and performs validated navigation.
 */
export function navigateAira(route: string, navigate: NavigateFunction) {
  if (!route) return;

  let target = route;

  // Resolve legacy `/investigations/` aliases to standard `/cases/`
  if (route.startsWith('/investigations/')) {
    target = route.replace('/investigations/', '/cases/');
  } else if (route === '/investigations') {
    target = '/cases';
  } else if (route.startsWith('/investigations?')) {
    target = route.replace('/investigations?', '/cases?');
  }

  try {
    navigate(target);
  } catch (err) {
    console.error('[AIRA Navigation] Failed to navigate to target:', target, err);
  }
}
