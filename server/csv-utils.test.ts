import { describe, it, expect } from 'vitest';
import { parseCSV, generateCSV, validatePropertyRecord, type PropertyRecord } from './csv-utils';

describe('CSV Utilities', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV with required fields', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude
8.3,41,6.98,1.02,322,2.56,37.88,-122.23
6.8,35,5.5,1.1,1000,2.5,34.05,-118.24`;

      const records = parseCSV(csv);
      expect(records).toHaveLength(2);
      expect(records[0]?.median_income).toBe(8.3);
      expect(records[0]?.latitude).toBe(37.88);
      expect(records[1]?.median_income).toBe(6.8);
    });

    it('should preserve extra columns', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude,property_name
8.3,41,6.98,1.02,322,2.56,37.88,-122.23,SF Bay
6.8,35,5.5,1.1,1000,2.5,34.05,-118.24,LA`;

      const records = parseCSV(csv);
      expect(records).toHaveLength(2);
      expect(records[0]?.property_name).toBe('SF Bay');
      expect(records[1]?.property_name).toBe('LA');
    });

    it('should throw on missing required fields', () => {
      const csv = `median_income,house_age,ave_rooms
8.3,41,6.98
6.8,35,5.5`;

      expect(() => parseCSV(csv)).toThrow('Missing required fields');
    });

    it('should throw on invalid numeric values', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude
abc,41,6.98,1.02,322,2.56,37.88,-122.23`;

      expect(() => parseCSV(csv)).toThrow('invalid number');
    });

    it('should throw on mismatched column count', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude
8.3,41,6.98,1.02,322,2.56,37.88`;

      expect(() => parseCSV(csv)).toThrow('has 7 columns, expected 8');
    });

    it('should skip empty lines', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude
8.3,41,6.98,1.02,322,2.56,37.88,-122.23

6.8,35,5.5,1.1,1000,2.5,34.05,-118.24`;

      const records = parseCSV(csv);
      expect(records).toHaveLength(2);
    });

    it('should throw on empty CSV', () => {
      const csv = `median_income,house_age,ave_rooms,ave_bedrms,population,ave_occup,latitude,longitude`;

      expect(() => parseCSV(csv)).toThrow('must contain header and at least one data row');
    });

    it('should handle case-insensitive headers', () => {
      const csv = `MEDIAN_INCOME,HOUSE_AGE,AVE_ROOMS,AVE_BEDRMS,POPULATION,AVE_OCCUP,LATITUDE,LONGITUDE
8.3,41,6.98,1.02,322,2.56,37.88,-122.23`;

      const records = parseCSV(csv);
      expect(records).toHaveLength(1);
      expect(records[0]?.median_income).toBe(8.3);
    });
  });

  describe('generateCSV', () => {
    it('should generate CSV from prediction records', () => {
      const records = [
        {
          median_income: 8.3,
          house_age: 41,
          ave_rooms: 6.98,
          ave_bedrms: 1.02,
          population: 322,
          ave_occup: 2.56,
          latitude: 37.88,
          longitude: -122.23,
          predicted_price: 4.52,
          price_in_dollars: 452000,
          confidence: 0.9,
        },
      ];

      const csv = generateCSV(records);
      expect(csv).toContain('median_income');
      expect(csv).toContain('predicted_price');
      expect(csv).toContain('8.3');
      expect(csv).toContain('4.52');
    });

    it('should escape quotes in string values', () => {
      const records = [
        {
          median_income: 8.3,
          house_age: 41,
          ave_rooms: 6.98,
          ave_bedrms: 1.02,
          population: 322,
          ave_occup: 2.56,
          latitude: 37.88,
          longitude: -122.23,
          property_name: 'Smith"s Property',
          predicted_price: 4.52,
          price_in_dollars: 452000,
          confidence: 0.9,
        },
      ];

      const csv = generateCSV(records);
      expect(csv).toContain('Smith""s Property');
    });

    it('should include error column when present', () => {
      const records = [
        {
          median_income: 8.3,
          house_age: 41,
          ave_rooms: 6.98,
          ave_bedrms: 1.02,
          population: 322,
          ave_occup: 2.56,
          latitude: 37.88,
          longitude: -122.23,
          predicted_price: 4.52,
          price_in_dollars: 452000,
          confidence: 0.9,
          error: 'Validation failed',
        },
      ];

      const csv = generateCSV(records);
      expect(csv).toContain('error');
      expect(csv).toContain('Validation failed');
    });

    it('should return empty string for empty records', () => {
      const csv = generateCSV([]);
      expect(csv).toBe('');
    });
  });

  describe('validatePropertyRecord', () => {
    it('should accept valid record', () => {
      const record: PropertyRecord = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const error = validatePropertyRecord(record);
      expect(error).toBeNull();
    });

    it('should reject negative income', () => {
      const record: PropertyRecord = {
        median_income: -1.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const error = validatePropertyRecord(record);
      expect(error).toContain('income');
    });

    it('should reject excessive income', () => {
      const record: PropertyRecord = {
        median_income: 20.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const error = validatePropertyRecord(record);
      expect(error).toContain('income');
    });

    it('should reject latitude outside California', () => {
      const record: PropertyRecord = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 50.0,
        longitude: -120.5,
      };

      const error = validatePropertyRecord(record);
      expect(error).toContain('Latitude');
    });

    it('should reject longitude outside California', () => {
      const record: PropertyRecord = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -100.0,
      };

      const error = validatePropertyRecord(record);
      expect(error).toContain('Longitude');
    });

    it('should accept boundary values', () => {
      const record: PropertyRecord = {
        median_income: 0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 32.5,
        longitude: -124.5,
      };

      const error = validatePropertyRecord(record);
      expect(error).toBeNull();
    });
  });
});
