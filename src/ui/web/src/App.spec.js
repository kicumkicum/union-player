import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
    test('renders learn react link', () => {
        const {getByText, fireEvent, update} = render(<App />);

        const linkElement = getByText(/learn react/i);

        fireEvent('click');

        update();

        expect(linkElement).toBeInTheDocument();
    });

    test('renders learn react link', () => {
        const {getByText, fireEvent, update} = render(<App />);

        const linkElement = getByText(/learn react/i);

        fireEvent('click');

        update();

        expect(linkElement).toBeInTheDocument();
    });

    test('renders learn react link', () => {
        const {getByText, fireEvent, update} = render(<App />);

        const linkElement = getByText(/learn react/i);

        fireEvent('click');

        update();

        expect(linkElement).toBeInTheDocument();
    });
});
