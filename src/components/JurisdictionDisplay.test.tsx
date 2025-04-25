
import { render, screen } from '@testing-library/react';
import { JurisdictionDisplay } from './JurisdictionDisplay';
import { useJurisdiction } from '@/hooks/useJurisdiction';
import { useCompStatData } from '@/hooks/useCompStatData';
import { vi, describe, it, expect } from 'vitest';

// Mock the hooks
vi.mock('@/hooks/useJurisdiction', () => ({
  useJurisdiction: vi.fn(),
}));

vi.mock('@/hooks/useCompStatData', () => ({
  useCompStatData: vi.fn(),
}));

describe('JurisdictionDisplay', () => {
  it('renders loading state', () => {
    (useJurisdiction as any).mockReturnValue({
      isLoading: true,
      error: null,
    });

    (useCompStatData as any).mockReturnValue({
      isLoading: true,
      error: null,
    });

    render(<JurisdictionDisplay />);
    const loadingElement = screen.getByTestId('jurisdiction-loading');
    expect(loadingElement).toBeTruthy();
  });

  it('renders jurisdiction details', () => {
    (useJurisdiction as any).mockReturnValue({
      city: 'San Francisco',
      county: 'San Francisco County',
      state: 'California',
      isLoading: false,
      error: null,
    });

    (useCompStatData as any).mockReturnValue({
      isLoading: false,
      error: null,
    });

    render(<JurisdictionDisplay />);
    const jurisdictionText = screen.getByText(/San Francisco, San Francisco County, California/i);
    expect(jurisdictionText).toBeTruthy();
  });
});
