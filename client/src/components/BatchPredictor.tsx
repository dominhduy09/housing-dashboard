import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BatchResult {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  csv_content: string;
  error?: string;
}

export default function BatchPredictor() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setResult(null);

    try {
      const csvContent = await file.text();
      
      const response = await fetch('/api/batch-predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csv_content: csvContent }),
      });

      const data = await response.json() as BatchResult;

      if (!response.ok) {
        toast.error(data.error || 'Batch prediction failed');
        setResult(null);
        return;
      }

      setResult(data);
      toast.success(`Processed ${data.successful} properties successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process CSV');
      setResult(null);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadResults = () => {
    if (!result?.csv_content) return;

    const element = document.createElement('a');
    const file = new Blob([result.csv_content], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `predictions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample_properties.csv';
    link.download = 'sample_properties.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      <Card className="border-2 border-dashed border-border hover:border-accent/50 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-accent" />
            Batch Upload & Predict
          </CardTitle>
          <CardDescription>
            Upload a CSV file with multiple properties to get predictions for all of them at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CSV Format Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">Required CSV Columns:</p>
            <p className="text-sm text-muted-foreground font-mono">
              median_income, house_age, ave_rooms, ave_bedrms, population, ave_occup, latitude, longitude
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Optional: Add any additional columns (e.g., property_name, address) and they will be included in the results.
            </p>
          </div>

          {/* File Upload Area */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isLoading}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-1"
                variant="default"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Select CSV File
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadSample}
                variant="outline"
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Sample CSV
              </Button>
            </div>
            {fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-foreground">{result.total}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300">Successful</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.successful}</p>
                </div>
                {result.failed > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-700 dark:text-red-300">Failed</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.failed}</p>
                  </div>
                )}
              </div>

              {/* Download Results */}
              <Button
                onClick={handleDownloadResults}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Results CSV
              </Button>

              {result.failed > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-medium">{result.failed} record(s) had errors.</span> Check the "error" column in the results CSV for details.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ol className="space-y-2 list-decimal list-inside">
            <li>Download the sample CSV template to see the required format</li>
            <li>Prepare your CSV file with property data (8 required columns)</li>
            <li>Click "Select CSV File" and choose your prepared file</li>
            <li>The predictions will be processed and displayed</li>
            <li>Download the results CSV with all predictions and confidence scores</li>
          </ol>
          <p className="pt-2 text-xs">
            <span className="font-medium">Tip:</span> You can add extra columns (like property names or addresses) and they will be preserved in the results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
