import { render, screen } from '@testing-library/react';
import Home from '../../pages';

describe('Home', () => {
  const urlMock = 'http://localhost:3000';

  it('should have a image', () => {
    render(<Home />);

    const img = screen.getByRole('img', {
      name: 'Image of a light bulb with a question mark',
    });

    expect(img).toBeInTheDocument();
    expect(img).toBeValid();
    expect(img).toBeEmptyDOMElement();
    expect(img).toBeVisible();
  });

  it('should have a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: 'A quiz about sports in general. simple and fun',
    });
    const totalChildren = heading.childElementCount;

    expect(heading).toBeInTheDocument();
    expect(heading).toBeValid();
    expect(heading).not.toBeEmptyDOMElement();
    expect(heading).toBeVisible();

    expect(totalChildren).toEqual(3);
  });

  it('should have a link', () => {
    render(<Home />);

    const link = screen.getByRole('link', {
      name: 'Play Quiz',
    });

    expect(link).toHaveProperty('href', `${urlMock}/page-questions`);
    expect(link).toBeInTheDocument();
    expect(link).toBeValid();
    expect(link).not.toBeEmptyDOMElement();
    expect(link).toBeVisible();
  });
});
