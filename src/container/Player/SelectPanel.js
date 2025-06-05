import Button from '@enact/sandstone/Button';
import {Header, Panel} from '@enact/sandstone/Panels';
import RadioItem from '@enact/sandstone/RadioItem';
import Scroller from '@enact/sandstone/Scroller';
import Group from '@enact/ui/Group';

function SelectPanel({title, onHidePanels, onSelect, defaultSelectedIndex, options, ...rest}){
	return (
		<Panel {...rest}>
			<Header title={title} onClose={onHidePanels}>
				<Button onClick={onHidePanels} size="small">Cancel</Button>
			</Header>
			<Scroller>
				<Group
					childComponent={RadioItem}
					defaultSelected={defaultSelectedIndex}
					onSelect={onSelect}
					select="radio"
					selectedProp="selected"
				>
					{options}
				</Group>
			</Scroller>
		</Panel>
	);
}

export default SelectPanel;
