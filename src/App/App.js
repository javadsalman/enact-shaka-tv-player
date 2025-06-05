import Scroller from '@enact/sandstone/Scroller';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';

import PlayerPage from '../pages/PlayerPage';
import { useMemo, useState } from 'react';
import Button from '@enact/sandstone/Button';

const NavigationMenu = function ({setPage}) {
	return (
		<div style={{paddingTop: '80px'}}>
			<div>
			<Scroller>
					<Button onClick={() => setPage('player')}>
						Player
					</Button>
			</Scroller>
		</div>
		</div>
		
	);
}


// pages: navigation, player
const App = function ({...props}) {
	const [page, setPage] = useState('navigation');

	const content = useMemo(() => {
		if (page === 'navigation') {
			return <NavigationMenu setPage={setPage} />;
		} else if (page === 'player') {
			return <PlayerPage setPage={setPage} />;
		}
		return null;
	}, [page]);
	
	return (
		<div style={{backgroundColor: 'black', height: '100vh'}}>
			{content}
		</div>
	);
}

export default ThemeDecorator(App);
