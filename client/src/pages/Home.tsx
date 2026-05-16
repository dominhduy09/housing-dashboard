import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MapPin, Home as HomeIcon, BarChart3 } from 'lucide-react';
import PricePredictor from '@/components/PricePredictor';
import BatchPredictor from '@/components/BatchPredictor';

/**
 * California Housing Dashboard - Data-Driven Minimalism Design
 * 
 * Design Philosophy:
 * - Clean, professional aesthetic with strategic whitespace
 * - Teal (#0ea5a5) and coral (#f97316) accent colors
 * - Geometric precision with minimal visual clutter
 * - Smooth, purposeful animations (200-300ms transitions)
 * - Asymmetric layout with floating data cards
 */

// Sample data based on the housing prediction model
const modelMetrics = [
  { label: 'R² Score', value: '0.8037', description: 'Model explains 80% of variance' },
  { label: 'RMSE', value: '0.5072', description: 'Average prediction error' },
  { label: 'MAE', value: '0.3350', description: 'Mean absolute error' },
];

const featureImportance = [
  { name: 'Median Income', value: 35.2 },
  { name: 'Rooms/Household', value: 10.8 },
  { name: 'Latitude', value: 10.5 },
  { name: 'Longitude', value: 9.8 },
  { name: 'Population/HH', value: 8.2 },
  { name: 'Avg Occupancy', value: 7.5 },
  { name: 'House Age', value: 4.2 },
  { name: 'Avg Rooms', value: 3.8 },
];

const priceDistribution = [
  { range: '<$350K', count: 2400, percentage: 11.6 },
  { range: '$350K-$500K', count: 4200, percentage: 20.3 },
  { range: '$500K-$800K', count: 6800, percentage: 32.9 },
  { range: '$800K-$1.2M', count: 5200, percentage: 25.2 },
  { range: '>$1.2M', count: 2040, percentage: 9.9 },
];

const regionData = [
  { name: 'San Francisco Bay', price: 1.15, income: 8.3, population: 2401 },
  { name: 'Los Angeles', price: 0.95, income: 6.8, population: 3200 },
  { name: 'San Diego', price: 0.88, income: 6.5, population: 2800 },
  { name: 'Sacramento', price: 0.52, income: 5.2, population: 1800 },
  { name: 'Fresno', price: 0.35, income: 3.8, population: 1200 },
  { name: 'Central Valley', price: 0.42, income: 4.2, population: 1500 },
];

const COLORS = ['#0ea5a5', '#06b6d4', '#0891b2', '#0d9488', '#14b8a6'];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
                <span className="text-sm font-medium text-accent">California Housing Analysis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Explore California's Housing Price Patterns
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Interactive dashboard powered by machine learning. Discover what drives housing prices across California's diverse regions.
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent"></span>
                  <span className="text-foreground">20,640 properties analyzed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-accent"></span>
                  <span className="text-foreground">11 features engineered</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="/hero_california_map.png" 
                  alt="California Housing Map" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Performance Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Model Performance</h2>
            <p className="text-lg text-muted-foreground">
              Random Forest Regressor with hyperparameter tuning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {modelMetrics.map((metric) => (
              <Card key={metric.label} className="border-l-4 border-l-accent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visualizations */}
          <Tabs defaultValue="importance" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="importance">Feature Importance</TabsTrigger>
              <TabsTrigger value="distribution">Price Distribution</TabsTrigger>
              <TabsTrigger value="regions">Regional Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="importance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Importance in Price Prediction</CardTitle>
                  <CardDescription>
                    How much each feature contributes to the model's predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={featureImportance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0ea5a5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Housing Price Distribution</CardTitle>
                  <CardDescription>
                    Distribution of predicted prices across California
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={priceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {priceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {priceDistribution.map((item) => (
                      <div key={item.range} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-foreground w-12 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Price Comparison</CardTitle>
                  <CardDescription>
                    Relationship between median income and predicted prices by region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="income" name="Median Income" />
                      <YAxis type="number" dataKey="price" name="Predicted Price" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name="Price (in $100K)"
                        data={regionData}
                        fill="#0ea5a5"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Key Insights */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Median Income</span> is the strongest predictor of housing prices, accounting for 35.2% of the model's decision-making.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Geographic location</span> (latitude and longitude combined) contributes 20.3% to price predictions.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Property characteristics</span> like room count and occupancy add significant predictive power.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  Regional Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">San Francisco Bay Area</p>
                  <p className="text-sm text-muted-foreground">Highest prices ($1.15M avg) with highest median income ($8.3)</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Central Valley</p>
                  <p className="text-sm text-muted-foreground">Most affordable region ($420K avg) with lower income levels</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Price Range</p>
                  <p className="text-sm text-muted-foreground">Predictions span from $350K to over $1.2M across regions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Price Predictor Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Interactive Tools</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Predict Housing Prices</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Use our trained machine learning model to predict California housing prices. Adjust features like median income, location, and property characteristics to explore price patterns.
            </p>
          </div>
          
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="single">Single Property</TabsTrigger>
              <TabsTrigger value="batch">Batch Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="mt-6">
              <PricePredictor />
            </TabsContent>
            
            <TabsContent value="batch" className="mt-6">
              <BatchPredictor />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">About This Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Built with machine learning analysis of California's housing market. Data sourced from scikit-learn's California Housing dataset.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Dataset</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 20,640 housing records</li>
                <li>• 8 original features</li>
                <li>• 11 engineered features</li>
                <li>• 1990 census data</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Model Details</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Algorithm: Random Forest</li>
                <li>• R² Score: 0.8037</li>
                <li>• RMSE: 0.5072</li>
                <li>• MAE: 0.3350</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 California Housing Dashboard. Built with React, Recharts, and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
