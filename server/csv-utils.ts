/**
 * CSV parsing and generation utilities for batch predictions
 */

export interface PropertyRecord {
  median_income: number;
  house_age: number;
  ave_rooms: number;
  ave_bedrms: number;
  population: number;
  ave_occup: number;
  latitude: number;
  longitude: number;
  [key: string]: string | number;
}

export interface PredictionRecord extends PropertyRecord {
  predicted_price: number;
  price_in_dollars: number;
  confidence: number;
  error?: string;
}

const REQUIRED_FIELDS = [
  'median_income',
  'house_age',
  'ave_rooms',
  'ave_bedrms',
  'population',
  'ave_occup',
  'latitude',
  'longitude',
];

/**
 * Parse CSV string into array of property records
 */
export function parseCSV(csvContent: string): PropertyRecord[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must contain header and at least one data row');
  }

  const headers = lines[0]!.split(',').map((h) => h.trim().toLowerCase());

  // Validate required fields
  const missingFields = REQUIRED_FIELDS.filter(
    (field) => !headers.includes(field)
  );
  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')}`
    );
  }

  const records: PropertyRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map((v) => v.trim());
    if (values.length !== headers.length) {
      throw new Error(
        `Row ${i + 1} has ${values.length} columns, expected ${headers.length}`
      );
    }

    const record: PropertyRecord = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]!;
      const value = values[j]!;

      // Parse numeric fields
      if (REQUIRED_FIELDS.includes(header)) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          throw new Error(
            `Row ${i + 1}, column "${header}": invalid number "${value}"`
          );
        }
        record[header] = num;
      } else {
        // Keep extra fields as strings
        record[header] = value;
      }
    }

    records.push(record as PropertyRecord);
  }

  return records;
}

/**
 * Convert prediction records to CSV string
 */
export function generateCSV(records: PredictionRecord[]): string {
  if (records.length === 0) {
    return '';
  }

  // Get all unique field names from records
  const allFields = new Set<string>();
  records.forEach((record) => {
    Object.keys(record).forEach((key) => allFields.add(key));
  });

  // Order fields: input fields first, then prediction fields
  const inputFields = REQUIRED_FIELDS;
  const extraFields = Array.from(allFields).filter(
    (f) => !REQUIRED_FIELDS.includes(f) && !['predicted_price', 'price_in_dollars', 'confidence', 'error'].includes(f)
  );
  const predictionFields = ['predicted_price', 'price_in_dollars', 'confidence', 'error'];

  const headers = [...inputFields, ...extraFields, ...predictionFields];

  // Build CSV
  const lines: string[] = [];

  // Header row
  lines.push(headers.map((h) => `"${h}"`).join(','));

  // Data rows
  records.forEach((record) => {
    const values = headers.map((field) => {
      const value = record[field as keyof PredictionRecord];
      if (value === undefined || value === null) {
        return '';
      }
      if (typeof value === 'string') {
        // Escape quotes in strings
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    });
    lines.push(values.join(','));
  });

  return lines.join('\n');
}

/**
 * Validate a single property record
 */
export function validatePropertyRecord(record: PropertyRecord): string | null {
  const { median_income, latitude, longitude } = record;

  // Validate income range
  if (median_income < 0 || median_income > 15) {
    return `Median income must be between 0 and 15, got ${median_income}`;
  }

  // Validate California coordinates
  if (latitude < 32.5 || latitude > 42) {
    return `Latitude must be between 32.5 and 42 (California), got ${latitude}`;
  }

  if (longitude < -124.5 || longitude > -114) {
    return `Longitude must be between -124.5 and -114 (California), got ${longitude}`;
  }

  return null;
}
