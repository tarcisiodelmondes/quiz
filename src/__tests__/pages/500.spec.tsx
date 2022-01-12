import { render, screen } from '@testing-library/react';
import CustomPage500 from '../../pages/500';

describe('CustomPage500', () => {
  const urlMock = 'http://localhost:3000';

  it('should have a heading', () => {
    render(<CustomPage500 />);

    const heading = screen.getByRole('heading', {
      name: 'Sorry we had an internal error',
    });

    expect(heading).toBeInTheDocument();
    expect(heading).toBeValid();
    expect(heading).toBeVisible();
  });

  it('should have a link', () => {
    render(<CustomPage500 />);

    const link = screen.getByRole('link', {
      name: 'Go to home',
    });

    expect(link).toHaveProperty('href', `${urlMock}/`);
    expect(link).toBeInTheDocument();
    expect(link).toBeValid();
    expect(link).toBeVisible();
  });
});
