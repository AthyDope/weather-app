import { format } from 'date-fns';

/**
 * Formats a given timestamp to a readable date string.
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {string} formatStr - Format string from date-fns
 * @returns {string} - Formatted date
 */
export const formatDate = (timestamp, formatStr = 'EEEE, MMM do') => {
  if (!timestamp) return '';
  return format(new Date(timestamp * 1000), formatStr);
};

/**
 * Formats a given timestamp to it's localized time
 * @param {number} timestamp 
 * @returns {string} - Formatted time
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return format(new Date(timestamp * 1000), 'h:mm a');
};
