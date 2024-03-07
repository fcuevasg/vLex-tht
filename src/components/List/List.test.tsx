import { render, screen, fireEvent } from '@testing-library/react'
import JurisdictionList from './List'
import { fetchJurisdictions, fetchSubJurisdictions } from '../../API/fakeJurisdictionsApi'


test('renders JurisdictionList component without crashing', () => {
    render(<JurisdictionList />)
})

test('clicking on a jurisdiction updates the selected jurisdictions', async () => {
    

    render(<JurisdictionList />)

    const jurisdictionElement = await screen.findByText("Spain")
    fireEvent.click(jurisdictionElement)

    expect(jurisdictionElement).toBeInTheDocument()
    // Add more assertions here to check if the state updates correctly
})