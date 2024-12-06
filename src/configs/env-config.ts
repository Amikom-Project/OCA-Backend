export function GET_EXTERNAL_OCA_BASE_URL(): string {
  const EXTERNAL_OCA_BASE_URL = process.env.EXTERNAL_OCA_SERVICE_BASE_URL;
  if (!EXTERNAL_OCA_BASE_URL)
    throw new Error('EXTERNAL OCA BASE URL is missing');

  return EXTERNAL_OCA_BASE_URL;
}
