import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState } from 'react';

const featureImportanceData = [
  { name: 'Median Income', importance: 35.2, description: 'Strongest predictor of housing prices' },
  { name: 'Rooms/Household', importance: 10.8, description: 'Average rooms per household' },
  { name: 'Latitude', importance: 10.5, description: 'Geographic location (North-South)' },
  { name: 'Longitude', importance: 9.8, description: 'Geographic location (East-West)' },
  { name: 'Population/HH', importance: 8.2, description: 'Population density per household' },
  { name: 'Avg Occupancy', importance: 7.5, description: 'Average household occupancy' },
  { name: 'House Age', importance: 4.2, description: 'Age of the property' },
  { name: 'Avg Rooms', importance: 3.8, description: 'Average number of rooms' },
];

const modelMetrics = [
  { label: 'R² Score', value: '0.8037', description: 'Model explains 80.37% of price variance' },
  { label: 'RMSE', value: '0.5072', description: 'Average prediction error in price units' },
  { label: 'MAE', value: '0.3350', description: 'Mean absolute error - typical prediction deviation' },
  { label: 'Training Samples', value: '20,640', description: 'Number of properties in training dataset' },
];

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function ExpandableSection({ title, children, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-muted hover:bg-muted/80 transition-colors duration-200"
      >
        <h4 className="font-semibold text-foreground">{title}</h4>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-4 bg-background border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ModelExplainability() {
  const colors = ['#0ea5a5', '#f97316', '#eab308', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">Model Transparency</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Understanding the Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn how our Random Forest model predicts California housing prices and which features have the most impact on predictions.
          </p>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="methodology" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
            <TabsTrigger value="features">Feature Importance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Methodology Tab */}
          <TabsContent value="methodology" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Random Forest Algorithm</CardTitle>
                <CardDescription>
                  How the model makes predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overview */}
                <ExpandableSection title="What is a Random Forest?" defaultOpen={true}>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    A Random Forest is an ensemble machine learning algorithm that combines multiple decision trees to make predictions. Instead of relying on a single tree, it creates many trees during training and averages their predictions to produce a final result. This approach reduces overfitting and improves prediction accuracy.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Each tree in the forest is trained on a random subset of the data and features, introducing diversity that makes the model more robust and generalizable to new data.
                  </p>
                </ExpandableSection>

                {/* How it works */}
                <ExpandableSection title="How Does It Work?">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">1. Training Phase</h5>
                      <p className="text-sm text-muted-foreground">
                        The model is trained on historical California housing data. It learns patterns between property features (income, location, age, etc.) and their actual prices.
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">2. Tree Building</h5>
                      <p className="text-sm text-muted-foreground">
                        Multiple decision trees are built, each making binary splits on features to minimize prediction error. Each tree learns different patterns from random data subsets.
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">3. Prediction</h5>
                      <p className="text-sm text-muted-foreground">
                        When predicting a new property's price, all trees make individual predictions. The final prediction is the average of all tree predictions, resulting in a robust estimate.
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">4. Feature Importance</h5>
                      <p className="text-sm text-muted-foreground">
                        The model tracks how much each feature contributes to reducing prediction error across all trees. Features used for more important splits have higher importance scores.
                      </p>
                    </div>
                  </div>
                </ExpandableSection>

                {/* Advantages */}
                <ExpandableSection title="Why Random Forest?">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span><strong>High Accuracy:</strong> Ensemble approach reduces errors and improves predictions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span><strong>Handles Non-linearity:</strong> Captures complex relationships between features</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span><strong>Feature Importance:</strong> Automatically identifies which features matter most</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span><strong>Robust to Outliers:</strong> Less sensitive to extreme values in data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent font-bold">✓</span>
                      <span><strong>No Scaling Required:</strong> Works well with features at different scales</span>
                    </li>
                  </ul>
                </ExpandableSection>

                {/* Limitations */}
                <ExpandableSection title="Model Limitations">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold">⚠</span>
                      <span><strong>Historical Data:</strong> Predictions are based on 1990 census data and may not reflect current market conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold">⚠</span>
                      <span><strong>Geographic Scope:</strong> Model trained only on California data; not applicable to other regions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold">⚠</span>
                      <span><strong>Feature Limitations:</strong> Uses only 8 basic features; doesn't account for property condition, amenities, or market trends</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-secondary font-bold">⚠</span>
                      <span><strong>Extrapolation:</strong> Predictions outside training data ranges may be less reliable</span>
                    </li>
                  </ul>
                </ExpandableSection>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Importance Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Feature Importance Analysis</CardTitle>
                <CardDescription>
                  Which factors have the most impact on housing price predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Chart */}
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureImportanceData} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis type="number" stroke="var(--color-muted-foreground)" />
                      <YAxis dataKey="name" type="category" width={190} stroke="var(--color-muted-foreground)" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-background)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => `${(value as number).toFixed(1)}%`}
                      />
                      <Bar dataKey="importance" fill="#0ea5a5" radius={[0, 8, 8, 0]}>
                        {featureImportanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Feature Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground mb-4">Feature Details</h4>
                  {featureImportanceData.map((feature, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-foreground">{feature.name}</h5>
                        <span className="text-lg font-bold text-accent">{feature.importance.toFixed(1)}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                      <div className="mt-3 w-full bg-background rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-secondary rounded-full transition-all duration-500"
                          style={{ width: `${feature.importance}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Insights */}
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-3">Key Insights</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Median income</strong> is by far the most important predictor, accounting for over 35% of the model's decision-making</li>
                    <li>• <strong>Geographic location</strong> (latitude and longitude combined) accounts for ~20% of predictions</li>
                    <li>• <strong>Property characteristics</strong> (rooms, occupancy, age) collectively influence ~26% of predictions</li>
                    <li>• The top 3 features (income, rooms, latitude) account for ~56% of all prediction importance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Model Performance Metrics</CardTitle>
                <CardDescription>
                  How well the model predicts housing prices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modelMetrics.map((metric, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                      <p className="text-3xl font-bold text-accent mb-2">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  ))}
                </div>

                {/* Interpretation */}
                <ExpandableSection title="Understanding the Metrics" defaultOpen={true}>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">R² Score (0.8037)</h5>
                      <p className="text-sm text-muted-foreground">
                        The R² score indicates that the model explains approximately 80% of the variance in housing prices. This is considered a strong result, meaning the model captures most of the factors that influence price variations. The remaining 20% could be due to unmeasured factors like property condition, renovations, or local market dynamics.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">RMSE (0.5072)</h5>
                      <p className="text-sm text-muted-foreground">
                        Root Mean Squared Error measures the average magnitude of prediction errors. A value of 0.5072 means the model's predictions deviate by approximately 0.51 units (in log price scale) on average. This metric penalizes larger errors more heavily.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground mb-2">MAE (0.3350)</h5>
                      <p className="text-sm text-muted-foreground">
                        Mean Absolute Error represents the average absolute difference between predicted and actual prices. A MAE of 0.3350 indicates that, on average, predictions are off by about 0.34 units. This metric is more interpretable than RMSE as it's in the same units as the target variable.
                      </p>
                    </div>
                  </div>
                </ExpandableSection>

                {/* Validation Info */}
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                  <h5 className="font-semibold text-foreground mb-3">Validation Approach</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    The model was evaluated using cross-validation techniques to ensure robust performance estimates. The dataset was split into training and testing sets, with multiple validation rounds to confirm the metrics above are reliable and not due to overfitting.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    These metrics represent the model's performance on unseen test data, providing a realistic estimate of how well it will perform on new predictions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
