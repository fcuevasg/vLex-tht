import Box from '@mui/material/Box'
import { FC, useEffect, useState } from 'react'
import { fetchJurisdictions, fetchSubJurisdictions } from '../../API/fakeJurisdictionsApi'
import { JurisdictionType } from '../../API/fakeJurisdictionType'
import { Alert, CircularProgress } from '@mui/material'
import HeroText from '../HeroText/HeroText'

const JurisdictionList: FC = () => {
	//States
	const [jurisdictions, setJurisdictions] = useState<JurisdictionType[]>()
	const [errors, setErrors] = useState<string>()
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionType[]>([])
	const [title, setTitle] = useState<string[]>([])

	//Logic to handle events
	const handleClickJurisdiction = (event: any, jurisdiction: JurisdictionType) => {
		event.stopPropagation() //Needed for MaterialUI to not collapse the tree when clicking on a jurisdiction
		setLoading(true)
		setSelectedJurisdiction([...selectedJurisdiction, jurisdiction])
		setTitle([...title, jurisdiction.name])
		fetchSubJurisdictions(jurisdiction.id)
			.then((subJurisdictions) => {
				//Make it recursively search for the jurisdiction and update the subJurisdictions
				const JurisdictionsWithSubs = updateJurisdictionsWithSubs(jurisdictions, jurisdiction.id, subJurisdictions) //Make it recursively search for the jurisdiction and update the subJurisdictions
				setJurisdictions(JurisdictionsWithSubs)
        setErrors('') //clean the errors
				setLoading(false)
			})
			.catch((error) => {
				setErrors(error.message)
			})
	}

	//Logic to update the jurisdictions with the subJurisdictions
	const updateJurisdictionsWithSubs = (jurisdictions: JurisdictionType[] | undefined, jurisdictionId: number, subJurisdictions: JurisdictionType[]): JurisdictionType[] | undefined => {
		if (!jurisdictions) return jurisdictions
		return jurisdictions.map((j) => {
			if (j.id === jurisdictionId) {
				j.subJurisdictions = subJurisdictions
			} else if (j.subJurisdictions) {
				j.subJurisdictions = updateJurisdictionsWithSubs(j.subJurisdictions, jurisdictionId, subJurisdictions)
			}
			return j
		})
	}

	//Needed for the recursive rendering of the tree
	const renderTreeItems = (jurisdiction: JurisdictionType) => {
		return (
			<Box className='relative ml-8 mb-2 '>
				<input type='checkbox' checked={selectedJurisdiction.some((jur) => jur.id === jurisdiction.id)} onChange={(event) => handleClickJurisdiction(event, jurisdiction)} />
				<label className='ml-2'>{jurisdiction.name}</label>
				{jurisdiction.subJurisdictions &&
					jurisdiction.subJurisdictions.map(function (subJurisdiction) {
						return renderTreeItems(subJurisdiction)
					})}
			</Box>
		)
	}

	//If no dependency is declared, it will run every time the component is mounted
	useEffect(() => {
		fetchJurisdictions()
			.then((response) => {
				if (response) {
					setErrors('')
					setJurisdictions(response)
				}
			})
			.catch((error) => {
				setJurisdictions([])
				setErrors(error.message)
			})
	}, [])

	return (
		<Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 600 }}>
			<HeroText text={title.join(', ') || ''} />
			{errors ? (
				<div>
					<Alert className='absolute top-3 right-3' severity='error'>
						{errors}
					</Alert>
				</div>
			) : (
				<Box className='text-left text-xl'>
					{jurisdictions ? (
						<>{!loading ? jurisdictions.map(renderTreeItems) : <CircularProgress />}</>
					) : (
						<Box className='text-center flex items-start justify-center text-center mt-5'>
							<CircularProgress />
						</Box>
					)}
				</Box>
			)}
		</Box>
	)
}

export default JurisdictionList
