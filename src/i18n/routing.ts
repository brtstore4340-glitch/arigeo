import {createSharedPathnamesNavigation} from 'next-intl/navigation';

// Plain routing config — next-intl 3.15 has no defineRouting (arrived in later 3.x).
export const routing = {
  // A list of all locales that are supported
  locales: ['en', 'th'],
  // Used when no locale matches
  defaultLocale: 'th'
} as const;

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);
