import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelExplainability from './ModelExplainability';

describe('ModelExplainability Component', () => {
  it('should render the component with main heading', () => {
    render(<ModelExplainability />);
    expect(screen.getByText('Understanding the Model')).toBeInTheDocument();
  });

  it('should render three tabs: Methodology, Features, Performance', () => {
    render(<ModelExplainability />);
    expect(screen.getByText('Methodology')).toBeInTheDocument();
    expect(screen.getByText('Feature Importance')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
  });

  it('should render the Methodology tab content by default', () => {
    render(<ModelExplainability />);
    expect(screen.getByText('Random Forest Algorithm')).toBeInTheDocument();
  });

  it('should render expandable sections in Methodology tab', () => {
    render(<ModelExplainability />);
    expect(screen.getByText('What is a Random Forest?')).toBeInTheDocument();
    expect(screen.getByText('How Does It Work?')).toBeInTheDocument();
    expect(screen.getByText('Why Random Forest?')).toBeInTheDocument();
    expect(screen.getByText('Model Limitations')).toBeInTheDocument();
  });

  it('should display feature importance data in Features tab', async () => {
    render(<ModelExplainability />);
    const featuresTab = screen.getByText('Feature Importance');
    await userEvent.click(featuresTab);
    
    expect(screen.getByText('Median Income')).toBeInTheDocument();
    expect(screen.getByText('Rooms/Household')).toBeInTheDocument();
    expect(screen.getByText('Latitude')).toBeInTheDocument();
  });

  it('should show feature importance percentages', async () => {
    render(<ModelExplainability />);
    const featuresTab = screen.getByText('Feature Importance');
    await userEvent.click(featuresTab);
    
    // Check for the top feature importance percentage
    expect(screen.getByText('35.2%')).toBeInTheDocument();
  });

  it('should display performance metrics in Performance tab', async () => {
    render(<ModelExplainability />);
    const performanceTab = screen.getByText('Performance');
    await userEvent.click(performanceTab);
    
    expect(screen.getByText('Model Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('R² Score')).toBeInTheDocument();
    expect(screen.getByText('RMSE')).toBeInTheDocument();
    expect(screen.getByText('MAE')).toBeInTheDocument();
  });

  it('should display correct metric values', async () => {
    render(<ModelExplainability />);
    const performanceTab = screen.getByText('Performance');
    await userEvent.click(performanceTab);
    
    expect(screen.getByText('0.8037')).toBeInTheDocument();
    expect(screen.getByText('0.5072')).toBeInTheDocument();
    expect(screen.getByText('0.3350')).toBeInTheDocument();
  });

  it('should render section description text', () => {
    render(<ModelExplainability />);
    expect(screen.getByText(/Learn how our Random Forest model predicts/)).toBeInTheDocument();
  });

  it('should render key insights in Features tab', async () => {
    render(<ModelExplainability />);
    const featuresTab = screen.getByText('Feature Importance');
    await userEvent.click(featuresTab);
    
    expect(screen.getByText(/Median income is by far the most important predictor/)).toBeInTheDocument();
  });

  it('should render validation approach in Performance tab', async () => {
    render(<ModelExplainability />);
    const performanceTab = screen.getByText('Performance');
    await userEvent.click(performanceTab);
    
    expect(screen.getByText('Validation Approach')).toBeInTheDocument();
  });

  it('should display all 8 features in the feature list', async () => {
    render(<ModelExplainability />);
    const featuresTab = screen.getByText('Feature Importance');
    await userEvent.click(featuresTab);
    
    const features = [
      'Median Income',
      'Rooms/Household',
      'Latitude',
      'Longitude',
      'Population/HH',
      'Avg Occupancy',
      'House Age',
      'Avg Rooms',
    ];
    
    features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('should render model advantages list', () => {
    render(<ModelExplainability />);
    expect(screen.getByText(/High Accuracy/)).toBeInTheDocument();
    expect(screen.getByText(/Handles Non-linearity/)).toBeInTheDocument();
    expect(screen.getByText(/Feature Importance/)).toBeInTheDocument();
  });

  it('should render model limitations list', () => {
    render(<ModelExplainability />);
    expect(screen.getByText(/Historical Data/)).toBeInTheDocument();
    expect(screen.getByText(/Geographic Scope/)).toBeInTheDocument();
    expect(screen.getByText(/Feature Limitations/)).toBeInTheDocument();
  });
});
