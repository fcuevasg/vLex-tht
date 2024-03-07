import { Box } from '@mui/material'
import React, { FC } from 'react'

interface HeroTextProps {
	text?: string
}

const HeroText: FC<HeroTextProps> = ({ text }) => {
	return (
		<Box sx={{ minHeight: 120, flexGrow: 1, maxWidth: 600 }}>
			<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-primary md:text-5xl lg:text-6xl mt-6">Jurisdictions</h1>
			 <h3 className="mb-4 text-l font-extrabold leading-none tracking-tight text-primary md:text-2xl lg:text-3xl mt-6">Selected jurisdiction: {text}</h3>
		</Box>
	)
}

export default HeroText
