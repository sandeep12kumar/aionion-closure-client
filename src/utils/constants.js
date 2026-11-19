/** Route for each step (current_step in the DB: 1..5). */
export const STEP_PATHS = {
  1: '/',
  2: '/client-info',
  3: '/documents',
  4: '/esign',
  5: '/success',
};

export const STEPS = ['Request', 'Client Info', 'Documents', 'eSign'];
export const TOTAL_STEPS = STEPS.length;

export const ACCOUNT_TYPES = [
  { value: 'TRADING', label: 'Trading account', description: 'Close trading in NSE / BSE segments' },
  { value: 'DEMAT', label: 'Demat account', description: 'Close the demat (DP) account' },
  { value: 'BOTH', label: 'Both Trading & Demat Accounts', description: 'Close trading and demat together' },
];

export const ACCOUNT_TYPE_LABEL = {
  TRADING: 'Trading Account',
  DEMAT: 'Demat Account',
  BOTH: 'Trading & Demat Accounts',
};

// Same list as server/config/constants.js CLOSURE_REASONS (the server's list is loaded from /meta)
export const FALLBACK_REASONS = [
  'Shifting of account',
  'Nill holdings/Nill balance',
];

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export const STEP1_NOTES = [
  'This link is only for individual accounts. For other account types, please contact your branch or Relationship Manager (RM).',
  'You can close your demat account without providing a reason.',
  'This check verifies if your account has any holdings or outstanding balances.',
  'You must upload a clear photo or scan of your handwritten signature and the digitally signed Client Master Report (CMR) from your other DP.',
];
