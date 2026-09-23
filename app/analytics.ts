export type AnalyticsEvent = 'search' | 'filter' | 'view_detail' | 'contact_channel';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  label?: string;
}

// Privacy-first adapter. It intentionally sends nothing until Lamie chooses a
// tool, consent policy and production configuration.
export const trackEvent = (_payload: AnalyticsPayload): void => undefined;
