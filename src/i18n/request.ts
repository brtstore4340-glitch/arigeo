import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({locale}) => {
  // This typically corresponds to the `[locale]` segment.
  // next-intl 3.15 passes `locale` directly (requestLocale arrived in 3.22).
  const resolved =
    locale && (routing.locales as readonly string[]).includes(locale)
      ? locale
      : routing.defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default
  };
});
