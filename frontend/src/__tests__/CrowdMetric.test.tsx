import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CrowdMetric } from '../components/CrowdMetric';

describe('CrowdMetric Component', () => {
  it('renders correctly with normal density', () => {
    render(<CrowdMetric name="East Gate" density={0.5} status="Normal" />);
    
    expect(screen.getByText('East Gate')).toBeDefined();
    expect(screen.getByText('50%')).toBeDefined();
    expect(screen.getByText('Normal')).toBeDefined();
  });

  it('displays warning style for congested status', () => {
    const { container } = render(<CrowdMetric name="Main Concourse" density={0.85} status="Congested" />);
    
    // Check if progress bar has appropriate color (using Tailwind class as marker)
    const progressBar = container.querySelector('.bg-orange-500');
    expect(progressBar).not.toBeNull();
  });

  it('displays critical style for high density', () => {
    const { container } = render(<CrowdMetric name="VIP Lounge" density={0.97} status="Critical" />);
    
    const progressBar = container.querySelector('.bg-red-500');
    expect(progressBar).not.toBeNull();
  });

  it('has appropriate accessibility attributes', () => {
    render(<CrowdMetric name="Test Zone" density={0.5} status="Normal" />);
    
    const region = screen.getByRole('group');
    expect(region).toBeDefined();
    expect(region.getAttribute('aria-label')).toContain('Test Zone');
  });
});
