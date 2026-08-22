import { NavigateFunction } from 'react-router-dom';

/**
 * Centrally maps Karen intelligence intents or routes into actual platform paths
 * and performs navigation.
 */
export function navigateKaren(route: string, navigate: NavigateFunction) {
  let target = route;

  // Resolve `/investigations/` aliases to `/cases/`
  if (route.startsWith('/investigations/')) {
    target = route.replace('/investigations/', '/cases/');
  } else if (route === '/investigations') {
    target = '/cases';
  } else if (route.startsWith('/investigations?')) {
    target = route.replace('/investigations?', '/cases?');
  }

  navigate(target);
}
