import Item from '@enact/sandstone/Item';
import PropTypes from 'prop-types';
import {useCallback} from 'react';

const SampleItem = ({children, navigate, path, index, ...rest}) => {
	const itemSelect = useCallback(() => {
		navigate({pathname: path, params: {videoIndex: index}});
	}, [navigate, path, index]);

	return (
		<Item {...rest} onClick={itemSelect}>
			{children}
		</Item>
	);
};

SampleItem.propTypes = {
	navigate: PropTypes.func,
	path: PropTypes.any
};

export default SampleItem;
