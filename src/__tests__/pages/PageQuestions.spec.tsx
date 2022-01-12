import { fireEvent, render, screen } from '@testing-library/react';
import PageQuestions from '../../pages/page-questions';

describe('PageQuestions', () => {
  const resultsMock = [
    {
      category: 'Sports',
      type: 'multiple',
      difficulty: 'easy',
      question: 'In golf, what name is given to a hole score of two under par?',
      correct_answer: 'Eagle',
      incorrect_answers: ['Birdie', 'Bogey', 'Albatross'],
    },
    {
      category: 'Sports',
      type: 'multiple',
      difficulty: 'easy',
      question:
        'Which English football club has the nickname &#039;The Foxes&#039;?',
      correct_answer: 'Leicester City',
      incorrect_answers: [
        'Northampton Town',
        'Bradford City',
        'West Bromwich Albion',
      ],
    },
  ];

  const allAnswerShuffleMock = [
    ['Bogey', 'Eagle', 'Albatross', 'Birdie'],
    [
      'Northampton Town',
      'Leicester City',
      'West Bromwich Albion',
      'Bradford City',
    ],
  ];

  const createSut = () => {
    render(
      <PageQuestions
        results={resultsMock}
        allAnswerShuffle={allAnswerShuffleMock}
      />,
    );
  };

  describe('Section questions', () => {
    it('should have a question title', () => {
      createSut();

      const title = screen.getByRole('heading', {
        name: resultsMock[0].question,
      });

      expect(title).toHaveTextContent(
        'In golf, what name is given to a hole score of two under par?',
      );
      expect(title).toBeInTheDocument();
      expect(title).toBeValid();
      expect(title).toBeVisible();
    });

    it('should have a disabled button', () => {
      createSut();

      const button = screen.getByRole('button', { name: 'Next' });

      expect(button).toBeDisabled();
      expect(button).toBeInTheDocument();
      expect(button).toBeValid();
      expect(button).toBeVisible();
    });

    it('should apply the green color to the correct answer and the button is active', () => {
      createSut();

      const answerCorrect = screen.getByRole('button', { name: 'Eagle' });
      const button = screen.getByRole('button', { name: 'Next' });

      expect(button).toBeDisabled();
      expect(answerCorrect).not.toBeDisabled();

      fireEvent.click(answerCorrect);

      expect(button).not.toBeDisabled();
      expect(answerCorrect).toBeDisabled();

      expect(answerCorrect).toHaveClass('correct');
      expect(answerCorrect).toBeInTheDocument();
      expect(answerCorrect).toBeValid();
      expect(answerCorrect).toBeVisible();
    });

    it('should apply the red color to the incorrect answer and the button is active', () => {
      createSut();

      const answerCorrect = screen.getByRole('button', { name: 'Birdie' });
      const button = screen.getByRole('button', { name: 'Next' });

      expect(button).toBeDisabled();
      expect(answerCorrect).not.toBeDisabled();

      fireEvent.click(answerCorrect);

      expect(button).not.toBeDisabled();
      expect(answerCorrect).toBeDisabled();

      expect(answerCorrect).toHaveClass('incorrect');
      expect(answerCorrect).toBeInTheDocument();
      expect(answerCorrect).toBeValid();
      expect(answerCorrect).toBeVisible();
    });

    it('should have a progress bar in 50%.', () => {
      createSut();

      const progressBar = screen.getByTestId('progress-bar');

      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toBeValid();
      expect(progressBar).toBeVisible();
      expect(progressBar).toHaveStyle('width: 0%');

      const answerCorrect = screen.getByRole('button', { name: 'Eagle' });
      const nextButton = screen.getByRole('button', { name: 'Next' });

      fireEvent.click(answerCorrect);
      fireEvent.click(nextButton);

      expect(progressBar).toHaveStyle('width: 50%');
    });

    it('should show the total number of matches to play in the game', () => {
      createSut();

      const allLevels = screen.getByTestId('all-levels');

      expect(allLevels).toHaveTextContent('2');
      expect(allLevels).toBeInTheDocument();
      expect(allLevels).toBeValid();
      expect(allLevels).toBeVisible();
    });

    it('should show the current number of matches in the game', () => {
      createSut();

      const allLevels = screen.getByTestId('current-level');

      expect(allLevels).toHaveTextContent('0');
      expect(allLevels).toBeInTheDocument();
      expect(allLevels).toBeValid();
      expect(allLevels).toBeVisible();

      const answerCorrect = screen.getByRole('button', { name: 'Eagle' });
      const nextButton = screen.getByRole('button', { name: 'Next' });

      fireEvent.click(answerCorrect);
      fireEvent.click(nextButton);

      expect(allLevels).toHaveTextContent('1');
    });
  });

  describe('Modal quiz completed', () => {
    beforeEach(() => {
      createSut();

      const answerCorrect = screen.getByRole('button', { name: 'Eagle' });
      const nextButton = screen.getByRole('button', { name: 'Next' });

      fireEvent.click(answerCorrect);
      fireEvent.click(nextButton);

      const answerIncorrect = screen.getByRole('button', {
        name: 'Bradford City',
      });

      fireEvent.click(answerIncorrect);
      fireEvent.click(nextButton);
    });

    it('should have a heading', () => {
      createSut();

      const heading = screen.getByRole('heading', { name: 'Completed quiz' });

      expect(heading).toBeInTheDocument();
      expect(heading).toBeValid();
      expect(heading).toBeVisible();
    });

    it('should have a paragraph with all the correct answer punctuation', () => {
      createSut();

      const paragraph = screen.getByText('Correct answers:');
      const span = paragraph.getElementsByTagName('span');

      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toBeValid();
      expect(paragraph).toBeVisible();
      expect(paragraph).not.toBeEmptyDOMElement();

      expect(span[0]).toHaveTextContent('1');
      expect(span[0]).toHaveClass('totalCorrect');
    });

    it('should have a paragraph with all the incorrect answer punctuation', () => {
      createSut();

      const paragraph = screen.getByText('Incorrect answers:');
      const span = paragraph.getElementsByTagName('span');

      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toBeValid();
      expect(paragraph).toBeVisible();
      expect(paragraph).not.toBeEmptyDOMElement();

      expect(span[0]).toHaveTextContent('1');
      expect(span[0]).toHaveClass('totalIncorrect');
    });

    it('should have a 50% success rate', () => {
      createSut();

      const span = screen.getByText('Hit rate: 50%');

      expect(span).toBeInTheDocument();
      expect(span).toBeValid();
      expect(span).toBeVisible();
      expect(span).not.toBeEmptyDOMElement();
    });

    it('should have a link', () => {
      createSut();

      const link = screen.getByRole('link', { name: 'Go to home page' });

      expect(link).toHaveAttribute('href', '/');
      expect(link).toBeInTheDocument();
      expect(link).toBeValid();
      expect(link).toBeVisible();
      expect(link).not.toBeEmptyDOMElement();
    });
  });
});
