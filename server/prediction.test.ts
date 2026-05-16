import { describe, it, expect } from 'vitest';
import { predictPrice, PredictionInput, PredictionResult } from './prediction';

describe('Price Prediction Service', () => {
  describe('predictPrice', () => {
    it('should successfully predict price for valid California location', async () => {
      const input: PredictionInput = {
        median_income: 8.3,
        house_age: 41,
        ave_rooms: 6.98,
        ave_bedrms: 1.02,
        population: 322,
        ave_occup: 2.56,
        latitude: 37.88,
        longitude: -122.23,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(true);
      expect(result.predicted_price).toBeDefined();
      expect(result.price_in_dollars).toBeDefined();
      expect(result.confidence).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return reasonable price range for San Francisco Bay Area', async () => {
      const input: PredictionInput = {
        median_income: 8.3,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.88,
        longitude: -122.23,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(true);
      expect(result.predicted_price).toBeGreaterThan(2.5); // Should be expensive
      expect(result.predicted_price).toBeLessThan(5.0);
      expect(result.price_in_dollars).toBeGreaterThan(250000);
    });

    it('should return lower price for rural areas', async () => {
      const input: PredictionInput = {
        median_income: 3.5,
        house_age: 40,
        ave_rooms: 5.0,
        ave_bedrms: 1.0,
        population: 500,
        ave_occup: 2.5,
        latitude: 39.0,
        longitude: -121.0,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(true);
      expect(result.predicted_price).toBeLessThan(2.0); // Should be cheaper
      expect(result.price_in_dollars).toBeLessThan(200000);
    });

    it('should return high confidence for typical California locations', async () => {
      const input: PredictionInput = {
        median_income: 5.0,
        house_age: 35,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1200,
        ave_occup: 2.5,
        latitude: 36.5,
        longitude: -120.5,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });

    it('should reject invalid latitude (outside California)', async () => {
      const input: PredictionInput = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 50.0, // Outside California
        longitude: -120.5,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Latitude');
    });

    it('should reject invalid longitude (outside California)', async () => {
      const input: PredictionInput = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -100.0, // Outside California
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Longitude');
    });

    it('should reject negative median income', async () => {
      const input: PredictionInput = {
        median_income: -1.0, // Invalid
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(false);
      expect(result.error).toContain('income');
    });

    it('should reject excessive median income', async () => {
      const input: PredictionInput = {
        median_income: 20.0, // Too high
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const result = await predictPrice(input);

      expect(result.success).toBe(false);
      expect(result.error).toContain('income');
    });

    it('should scale price with income', async () => {
      const lowIncomeInput: PredictionInput = {
        median_income: 3.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.0,
        longitude: -120.5,
      };

      const highIncomeInput: PredictionInput = {
        ...lowIncomeInput,
        median_income: 9.0,
      };

      const lowResult = await predictPrice(lowIncomeInput);
      const highResult = await predictPrice(highIncomeInput);

      expect(lowResult.success).toBe(true);
      expect(highResult.success).toBe(true);
      expect(highResult.predicted_price!).toBeGreaterThan(lowResult.predicted_price!);
    });

    it('should consider location in price prediction', async () => {
      const sfInput: PredictionInput = {
        median_income: 5.0,
        house_age: 30,
        ave_rooms: 5.5,
        ave_bedrms: 1.1,
        population: 1000,
        ave_occup: 2.5,
        latitude: 37.88, // San Francisco
        longitude: -122.23,
      };

      const ruralInput: PredictionInput = {
        ...sfInput,
        latitude: 39.0, // Rural area
        longitude: -121.0,
      };

      const sfResult = await predictPrice(sfInput);
      const ruralResult = await predictPrice(ruralInput);

      expect(sfResult.success).toBe(true);
      expect(ruralResult.success).toBe(true);
      expect(sfResult.predicted_price!).toBeGreaterThan(ruralResult.predicted_price!);
    });

    it('should return confidence between 0.5 and 1.0', async () => {
      const inputs: PredictionInput[] = [
        {
          median_income: 5.0,
          house_age: 30,
          ave_rooms: 5.5,
          ave_bedrms: 1.1,
          population: 1000,
          ave_occup: 2.5,
          latitude: 37.0,
          longitude: -120.5,
        },
        {
          median_income: 8.0,
          house_age: 40,
          ave_rooms: 6.0,
          ave_bedrms: 1.2,
          population: 2000,
          ave_occup: 2.8,
          latitude: 34.0,
          longitude: -118.0,
        },
      ];

      for (const input of inputs) {
        const result = await predictPrice(input);
        expect(result.success).toBe(true);
        expect(result.confidence).toBeGreaterThanOrEqual(0.5);
        expect(result.confidence).toBeLessThanOrEqual(1.0);
      }
    });
  });
});
