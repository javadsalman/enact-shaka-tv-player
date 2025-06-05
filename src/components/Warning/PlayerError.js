import Button from '@enact/sandstone/Button'
import css from './Warning.module.less'
import Icon from '@enact/sandstone/Icon'
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {useNavigate} from 'react-router-dom'
import { useCallback } from 'react';

function PlayerError({errorInfo, ...rest}) {
    const navigate = useNavigate()

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate])

    return (
        <div className={css.Container} {...rest}>
            <div className={css.Body}>
                <div className={css.IconWrapper}><Icon size="large" className={css.BigIcon}>spanner</Icon></div>
                <div className={css.Content}>{errorInfo.toString()}</div>
                    <div className={css.ButtonContainer}>
                    <Button size="large" css={css.Button} onClick={goBack}>Go Back</Button>
                </div>
            </div>
        </div>
    )
}

const PlayerErrorWithSpotlight = SpotlightContainerDecorator(PlayerError)

export default PlayerErrorWithSpotlight