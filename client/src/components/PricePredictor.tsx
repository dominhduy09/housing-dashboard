import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Loader2, TrendingUp, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PropertyMap from './PropertyMap';

interface PredictionInput {
  median_income: number;
  house_age: number;
  ave_rooms: number;
  ave_bedrms: number;
  population: number;
  ave_occup: number;
  latitude: number;
  longitude: number;
}

interface PredictionResult {
  predicted_price?: number;
  price_in_dollars?: number;
  confidence?: number;
  success: boolean;
  error?: string;
}

export default function PricePredictor() {
  const [input, setInput] = useState<PredictionInput>({
    median_income: 5.0,
    house_age: 30,
    ave_rooms: 5.5,
    ave_bedrms: 1.1,
    population: 1000,
    ave_occup: 2.5,
    latitude: 37.88,
    longitude: -122.23,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<Array<{ input: PredictionInput; result: PredictionResult; timestamp: Date }>>([]);

  const handleInputChange = (field: keyof PredictionInput, value: number) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);

      if (data.success) {
        setPredictionHistory(prev => [
          { input: { ...input }, result: data, timestamp: new Date() },
          ...prev.slice(0, 9) // Keep last 10 predictions
        ]);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const loadPrediction = (prediction: typeof predictionHistory[0]) => {
    setInput(prediction.input);
    setResult(prediction.result);
  };

  const presetLocations = {
    'San Francisco Bay': { latitude: 37.88, longitude: -122.23, median_income: 8.3 },
    'Los Angeles': { latitude: 34.05, longitude: -118.24, median_income: 6.8 },
    'San Diego': { latitude: 32.71, longitude: -117.16, median_income: 6.5 },
    'Sacramento': { latitude: 38.58, longitude: -121.49, median_income: 5.2 },
    'Central Valley': { latitude: 36.5, longitude: -120.5, median_income: 4.2 },
  };

  const applyPreset = (location: keyof typeof presetLocations) => {
    const preset = presetLocations[location];
    setInput(prev => ({
      ...prev,
      ...preset
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="predictor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictor" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Price Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictor" className="space-y-6">
          {/* Quick Presets */}
          <Card className="border-border bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Presets</CardTitle>
              <CardDescription>Select a California region to auto-fill typical values</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.keys(presetLocations).map(location => (
                  <Button
                    key={location}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(location as keyof typeof presetLocations)}
                    className="text-xs"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Input Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Input Features</CardTitle>
              <CardDescription>Adjust the sliders or enter values to predict housing prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Income */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Median Income</span>
                  <span className="text-accent font-semibold">${(input.median_income * 10000).toLocaleString()}</span>
                </Label>
                <Slider
                  value={[input.median_income]}
                  onValueChange={([value]) => handleInputChange('median_income', value)}
                  min={0.5}
                  max={15}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: $5,000 - $150,000</p>
              </div>

              {/* House Age */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>House Age</span>
                  <span className="text-accent font-semibold">{input.house_age.toFixed(0)} years</span>
                </Label>
                <Slider
                  value={[input.house_age]}
                  onValueChange={([value]) => handleInputChange('house_age', value)}
                  min={1}
                  max={52}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: 1 - 52 years</p>
              </div>

              {/* Average Rooms */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Average Rooms per Household</span>
                  <span className="text-accent font-semibold">{input.ave_rooms.toFixed(2)}</span>
                </Label>
                <Slider
                  value={[input.ave_rooms]}
                  onValueChange={([value]) => handleInputChange('ave_rooms', value)}
                  min={1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: 1 - 10 rooms</p>
              </div>

              {/* Average Bedrooms */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Average Bedrooms per Household</span>
                  <span className="text-accent font-semibold">{input.ave_bedrms.toFixed(2)}</span>
                </Label>
                <Slider
                  value={[input.ave_bedrms]}
                  onValueChange={([value]) => handleInputChange('ave_bedrms', value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: 0.5 - 3 bedrooms</p>
              </div>

              {/* Population */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Population</span>
                  <span className="text-accent font-semibold">{input.population.toLocaleString()}</span>
                </Label>
                <Slider
                  value={[input.population]}
                  onValueChange={([value]) => handleInputChange('population', value)}
                  min={100}
                  max={3500}
                  step={50}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: 100 - 3,500 people</p>
              </div>

              {/* Average Occupancy */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Average Occupancy per Household</span>
                  <span className="text-accent font-semibold">{input.ave_occup.toFixed(2)}</span>
                </Label>
                <Slider
                  value={[input.ave_occup]}
                  onValueChange={([value]) => handleInputChange('ave_occup', value)}
                  min={0.5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Range: 0.5 - 5 people</p>
              </div>

              {/* Latitude */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Latitude</span>
                  <span className="text-accent font-semibold">{input.latitude.toFixed(2)}°</span>
                </Label>
                <Slider
                  value={[input.latitude]}
                  onValueChange={([value]) => handleInputChange('latitude', value)}
                  min={32}
                  max={42}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">California range: 32° - 42°N</p>
              </div>

              {/* Longitude */}
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Longitude</span>
                  <span className="text-accent font-semibold">{input.longitude.toFixed(2)}°</span>
                </Label>
                <Slider
                  value={[input.longitude]}
                  onValueChange={([value]) => handleInputChange('longitude', value)}
                  min={-125}
                  max={-114}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">California range: -125° to -114°W</p>
              </div>

              {/* Predict Button */}
              <Button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Predict Price
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && result.success && (
            <Card className="border-accent bg-accent/5">
              <CardHeader>
                <CardTitle className="text-accent">Prediction Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Predicted Price</p>
                    <p className="text-3xl font-bold text-accent">
                      ${(result.price_in_dollars || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((result.predicted_price || 0) * 100000).toLocaleString('en-US', { maximumFractionDigits: 0 })} (in $100K units)
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Score</p>
                    <p className="text-3xl font-bold text-secondary">
                      {((result.confidence || 0) * 100).toFixed(0)}%
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(result.confidence || 0) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-lg font-semibold text-foreground">
                      {input.latitude.toFixed(2)}°N, {input.longitude.toFixed(2)}°W
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Income: ${(input.median_income * 10000).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-2">Key Factors</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Median income is the strongest price predictor (35.2% importance)</li>
                    <li>• Geographic location (latitude/longitude) accounts for ~20% of price variation</li>
                    <li>• Room and occupancy metrics influence ~11% of the prediction</li>
                    <li>• House age and population have minor effects on price</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <PropertyMap
            properties={[
              ...predictionHistory.map(p => ({
                latitude: p.input.latitude,
                longitude: p.input.longitude,
                predicted_price: p.result.predicted_price,
                price_in_dollars: p.result.price_in_dollars,
                confidence: p.result.confidence,
                median_income: p.input.median_income,
                house_age: p.input.house_age,
                label: `$${(p.result.price_in_dollars || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              })),
              ...(result && result.success ? [{
                latitude: input.latitude,
                longitude: input.longitude,
                predicted_price: result.predicted_price,
                price_in_dollars: result.price_in_dollars,
                confidence: result.confidence,
                median_income: input.median_income,
                house_age: input.house_age,
                label: `Current: $${(result.price_in_dollars || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
              }] : [])
            ]}
            selectedProperty={result && result.success ? {
              latitude: input.latitude,
              longitude: input.longitude,
              predicted_price: result.predicted_price,
              price_in_dollars: result.price_in_dollars,
              confidence: result.confidence,
              median_income: input.median_income,
              house_age: input.house_age
            } : undefined}
          />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {predictionHistory.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No predictions yet. Make a prediction to see history here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {predictionHistory.map((prediction, idx) => (
                <Card
                  key={idx}
                  className="border-border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => loadPrediction(prediction)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          ${(prediction.result.price_in_dollars || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {prediction.input.latitude.toFixed(2)}°N, {prediction.input.longitude.toFixed(2)}°W • Income: ${(prediction.input.median_income * 10000).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {prediction.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-secondary">
                          {((prediction.result.confidence || 0) * 100).toFixed(0)}% confidence
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
