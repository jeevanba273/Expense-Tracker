import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionPlans from './SubscriptionPlans';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

// Mock the contexts
vi.mock('../../contexts/AppContext');
vi.mock('../../contexts/AuthContext');

describe('SubscriptionPlans', () => {
  const mockUserPreferences = {
    currency: '₹',
    locale: 'en-IN',
    planTier: 'free'
  };

  const mockUpdateUserPreferences = vi.fn();

  beforeEach(() => {
    (useApp as any).mockReturnValue({
      userPreferences: mockUserPreferences,
      updateUserPreferences: mockUpdateUserPreferences
    });

    (useAuth as any).mockReturnValue({
      user: { email: 'test@example.com' },
      setShowAuthModal: vi.fn()
    });
  });

  it('renders subscription plans', () => {
    render(<SubscriptionPlans />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Plus')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('displays correct pricing', () => {
    render(<SubscriptionPlans />);
    
    expect(screen.getByText('₹ 0')).toBeInTheDocument();
    expect(screen.getByText('₹ 50')).toBeInTheDocument();
    expect(screen.getByText('₹ 80')).toBeInTheDocument();
  });

  it('shows current plan indicator', () => {
    render(<SubscriptionPlans />);
    
    const freePlanButton = screen.getByText('Current Plan');
    expect(freePlanButton).toBeInTheDocument();
    expect(freePlanButton).toBeDisabled();
  });

  it('displays feature comparison correctly', () => {
    render(<SubscriptionPlans />);
    
    // Check basic features
    expect(screen.getByText('Basic Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manual Import/Export')).toBeInTheDocument();
    
    // Check premium features
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('Family Workspace')).toBeInTheDocument();
  });

  it('handles plan selection', async () => {
    const user = userEvent.setup();
    render(<SubscriptionPlans />);
    
    // Try to select Plus plan
    const plusPlanButton = screen.getByText('Select Plan').closest('button');
    await user.click(plusPlanButton!);
    
    // Should show checkout modal or redirect to checkout
    expect(screen.getByText(/Upgrade to Plus/i)).toBeInTheDocument();
  });
});