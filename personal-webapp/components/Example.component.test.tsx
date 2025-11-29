import { render, screen } from '@testing-library/react'
import Example from './Example'

describe('Example', () => {
    it('renders the text', () => {
        render(<Example text="Hello World" />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
})
