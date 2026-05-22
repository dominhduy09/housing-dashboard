import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MapPin, Home as HomeIcon, BarChart3, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import PricePredictor from '@/components/PricePredictor';
import ModelExplainability from '@/components/ModelExplainability';

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
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <HomeIcon className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">California Housing Analysis</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Explore California's Housing Price Patterns
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Interactive dashboard powered by machine learning. Discover what drives housing prices across California's diverse regions.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-sm text-foreground">20,640 properties analyzed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-sm text-foreground">11 features engineered</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/96626251/ajya84z9dmED5NqWmxrMcj/hero_california_map-4Wj9FUNTQAumS7WGcKeeDP.webp"
                alt="California Housing Map"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Model Performance Metrics */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Model Performance</h2>
            <p className="text-muted-foreground">Random Forest Regressor with hyperparameter tuning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modelMetrics.map((metric, idx) => (
              <Card key={idx} className="border-border hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-1">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Visualizations */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="features" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Feature Importance</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Price Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="regions" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Regional Analysis</span>
              </TabsTrigger>
            </TabsList>

            {/* Feature Importance Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Feature Importance in Price Prediction</CardTitle>
                  <CardDescription>
                    Relative importance of each feature in the Random Forest model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '0.65rem' }}
                        formatter={(value) => `${(Number(value)).toFixed(1)}%`}
                      />
                      <Bar dataKey="value" fill="#0ea5a5" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Price Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Price Range Distribution</CardTitle>
                    <CardDescription>
                      Number of properties in each price bracket
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={priceDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '0.65rem' }}
                          formatter={(value) => value.toLocaleString()}
                        />
                        <Bar dataKey="count" fill="#0ea5a5" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Market Composition</CardTitle>
                    <CardDescription>
                      Percentage of properties by price range
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={priceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {priceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '0.65rem' }}
                          formatter={(value) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Regional Analysis Tab */}
            <TabsContent value="regions" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Regional Price vs Income Analysis</CardTitle>
                  <CardDescription>
                    Relationship between median income and housing prices across California regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="income" name="Median Income (x$10K)" unit=" x$10K" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="price" name="Median Price (x$100K)" unit=" x$100K" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '0.65rem' }}
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value) => (Number(value)).toFixed(2)}
                        labelFormatter={(label) => `Region: ${label}`}
                      />
                      <Scatter name="Regions" data={regionData} fill="#0ea5a5" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Regional Summary</CardTitle>
                  <CardDescription>
                    Key metrics for major California regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionData.map((region, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{region.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Income: ${(region.income * 10000).toLocaleString()} | Population: {(region.population * 1000).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent">${(region.price * 100000).toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">Median Price</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="py-12 md:py-16 bg-muted/30 border-t border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  Median Income Dominates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Median income is the strongest predictor of housing prices, accounting for over 35% of the model's decision-making. This reflects the fundamental relationship between household wealth and property values.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Geographic Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Location (latitude and longitude) accounts for nearly 20% of price variation. Coastal and metropolitan areas command significant premiums over inland regions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                  Model Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Random Forest model achieves an R² score of 0.8037, explaining approximately 80% of the variance in housing prices. RMSE of 0.5072 indicates strong predictive performance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-4"></div>
                  Market Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The market shows a concentration in the $500K-$800K range (33% of properties), with significant representation in the $350K-$500K bracket (20%). Premium properties ({'>'}$1.2M) represent 10% of the market.
                </p>
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
              <span className="text-sm font-medium text-accent">Interactive Tool</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Predict Housing Prices</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Use our trained machine learning model to predict California housing prices. Adjust features like median income, location, and property characteristics to explore price patterns.
            </p>
          </div>
          <PricePredictor />
        </div>
      </section>

      {/* Model Explainability Section */}
      <ModelExplainability />

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
          {/* About the Author Section */}
          <div className="py-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">About the Author</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  <span className="font-semibold text-foreground">Minh Duy Do</span> is a Computer Science student passionate about building modern, high-performance web applications. With a strong interest in AI, system design, and scalable software engineering, he focuses on creating impactful and efficient solutions.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  He has experience in full-stack development, machine learning, and cloud technologies, and actively builds projects, contributes to open-source, and explores new technologies to continuously grow as a developer. The Random Forest model powering this dashboard demonstrates his expertise in applying machine learning to real-world problems.
                </p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-secondary rounded-full mb-4 flex items-center justify-center">
                  <HomeIcon className="w-12 h-12 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-4">Connect</h4>
                <div className="flex gap-4">
                  <a href="https://github.com/dominhduy09" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-border hover:bg-accent transition-colors duration-200" title="GitHub">
                    <Github className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="https://linkedin.com/in/duy-do-minh-0b37501a9" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-border hover:bg-accent transition-colors duration-200" title="LinkedIn">
                    <Linkedin className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="mailto:dominhduy09@gmail.com" className="p-2 rounded-full bg-border hover:bg-accent transition-colors duration-200" title="Email">
                    <Mail className="w-5 h-5 text-foreground" />
                  </a>
                </div>
              </div>
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
