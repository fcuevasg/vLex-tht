import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { FC, useEffect, useState } from 'react'
import { fetchJurisdictions, fetchSubJurisdictions } from '../../API/fakeJurisdictionsApi'
import { JurisdictionType } from '../../API/fakeJurisdictionType'
import { Alert, CircularProgress } from '@mui/material'

const JurisdictionList: FC = () => {

	//States
	const [jurisdictions, setJurisdictions] = useState<JurisdictionType[]>()
	const [errors, setErrors] = useState<string>()
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionType>()


	//Logic to handle events
	const handleClickJurisdiction = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, jurisdiction: JurisdictionType) => {
		event.stopPropagation() //Needed for MaterialUI to not collapse the tree when clicking on a jurisdiction
		setLoading(true)
		setSelectedJurisdiction(jurisdiction)
		fetchSubJurisdictions(jurisdiction.id).then((subJurisdictions) => {
			//Make it recursively search for the jurisdiction and update the subJurisdictions
			const JurisdictionsWithSubs = updateJurisdictionsWithSubs(jurisdictions, jurisdiction.id, subJurisdictions) //Make it recursively search for the jurisdiction and update the subJurisdictions
			setJurisdictions(JurisdictionsWithSubs)
			setLoading(false)
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
			<TreeItem className='treeItem' key={jurisdiction.id} nodeId={jurisdiction.id.toString()} label={<div onClick={(event) => handleClickJurisdiction(event, jurisdiction)}>{jurisdiction.name}</div>}>
				{jurisdiction.subJurisdictions &&
					jurisdiction.subJurisdictions.map(function (subJurisdiction) {
						return renderTreeItems(subJurisdiction)
					})}
			</TreeItem>
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
			{errors ? (
				<div>
					<Alert className='alerts' severity='error'>
						{errors}
					</Alert>
				</div>
			) : (
				<TreeView className='treeView' aria-label='multi-select' defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />} multiSelect>
					{jurisdictions ? (
						<>
							<h1>Jurisdictions</h1>
							{selectedJurisdiction ? <h3>Selected jurisdiction: {selectedJurisdiction.name}</h3> : <></>}
							{!loading ? jurisdictions.map(renderTreeItems) : <CircularProgress />}
						</>
					) : (
						<Box sx={{ minHeight: 220, flexGrow: 1, maxWidth: 600 }}>
							<CircularProgress />
						</Box>
					)}
				</TreeView>
			)}
		</Box>
	)
}

export default JurisdictionList
