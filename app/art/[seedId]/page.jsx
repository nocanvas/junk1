// app/art/[seedId]/page.jsx
import React from 'react';
import P5Wrapper from '/components/P5Wrapper'; // Adjust the import path as necessary
import sketch from '/sketches/sketch'; // Adjust the import path as necessary

// The component name should start with an uppercase letter
// Props are directly destructured to get `params` from the server component's props
export default function Page({ params }) {
	// Access the seedId parameter from the URL
	const { seedId } = params;

	// Use the seedId with your sketch or pass it as a prop as needed
	// Adjust your sketch to optionally accept parameters if needed

	return (
		<div>
			<h1>Dynamic Art Piece: {seedId}</h1>
			<P5Wrapper sketch={sketch} />
		</div>
	);
}
