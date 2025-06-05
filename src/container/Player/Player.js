// import shaka from 'shaka-player';
import css from './Player.module.less';
import './Player.css'
import Button from '@enact/sandstone/Button';
import {MediaControls} from '@enact/sandstone/MediaPlayer';
import {Panels} from '@enact/sandstone/Panels';
import VideoPlayer from '@enact/sandstone/VideoPlayer';
import Spotlight from '@enact/spotlight';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import SelectPanel from './SelectPanel.js';
import BodyText from '@enact/sandstone/BodyText';
import Spinner from '../../components/Spinner/Spinner.js';
import PlayerErrorWithSpotlight from '../../components/Warning/PlayerError.js';
import { getQualityLabel } from './playerContrib.js';

const WATERMARK_SECONDS = 5;
const WATERMERK_SHOW_RATIO = 5;


function Player(props) {
    const {
        watermark,
        isDRM,
		drmType,
        drmLicenseKey,
        url,
        name,
        description,
		onBack,
    } = props;
    
	const [currentPanel, setCurrentPanel] = useState(null);
	const [qualitites, setQualities] = useState([]);
	const [currentQualityIndex, setCurrentQualityIndex] = useState(null);
	const [isAutoQuality, setIsAutoQuality] = useState(true);
	const [audios, setAudios] = useState([]);
	const [currentAudioIndex, setCurrentAudioIndex] = useState(null);
	const [subtitles, setSubtitles] = useState([]);
	const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(null);
	const [isLive, setIsLive] = useState(false);
	const [loading, setLoading] = useState(true);
	const [errorInfo, setErrorInfo] = useState(null);

	const videoRef = useRef(null);
	const shakaRef = useRef(null);
	const watermarkRef = useRef(null);



	const filteredQualities = useMemo(() => {
		const currentAudioLanguage = audios[currentAudioIndex]?.language || 'und';
		const result = [];
		qualitites.forEach((quality) => {
			if (
				quality.language === currentAudioLanguage
				&& result.findIndex((q) => q.height === quality.height) === -1
			) {
				result.push(quality);
			}
		})
		return result;
	}, [currentAudioIndex, audios, qualitites]);

	const onPanelClose = useCallback(() => {
		setCurrentPanel(null)
	}, []);

	const handleQualityPanelOpen = useCallback(() => {
		videoRef.current.hideControls();
		setCurrentPanel('quality')
	}, []);

	const handleAudioPanelOpen = useCallback(() => {
		videoRef.current.hideControls();
		setCurrentPanel('audio')
	}, []);

	const handleSubtitlePanelOpen = useCallback(() => {
		videoRef.current.hideControls();
		setCurrentPanel('subtitle')
	}, []);

	const onQualitySelect = useCallback(({selected}) => {
		const qualitiesLength = filteredQualities.length;
		if (selected === qualitiesLength) {
			shakaRef.current.configure({abr: {enabled: true}});
			setCurrentQualityIndex(null);
			setIsAutoQuality(true);
		} else {
			shakaRef.current.configure({abr: {enabled: false}});
			shakaRef.current.selectVariantTrack(filteredQualities[selected], true);
			setCurrentQualityIndex(selected);
			setIsAutoQuality(false);
		}
	}, [filteredQualities, shakaRef]);

	const onAudioSelect = useCallback(({selected}) => {
		shakaRef.current.selectAudioLanguage(audios[selected].language, audios[selected].role);
		setCurrentAudioIndex(selected);
	}, [audios, shakaRef]);


	// sometimes video can't be loaded even though there is no error. So we need to check if the video is loaded by timeout
	const loadVideo = useCallback(async ({player, video, url, timeout=0}) => {
		let videoLoaded = false;
		
		await player.load(url)

		setIsLive(player.isLive())

		const audioTracks = []
		player.getVariantTracks().forEach((track) => {
			if (track.language !== 'und' && audioTracks.findIndex((audio) => audio.language === track.language) === -1) {
				audioTracks.push(track);
			}
		});
		setAudios(audioTracks);
		let foundCurrentAudioIndex = audioTracks.findIndex((track) => track.active);
		foundCurrentAudioIndex = foundCurrentAudioIndex === -1 && audioTracks.length ? 0 : foundCurrentAudioIndex;
		setCurrentAudioIndex(foundCurrentAudioIndex);

		const qualityTracks = player.getVariantTracks();
		qualityTracks.sort((a, b) => b.height - a.height);
		setQualities(qualityTracks);
		setCurrentQualityIndex(qualityTracks.findIndex((track) => track.active));
		setIsAutoQuality(true);

		const textTracks = player.getTextTracks();
		setSubtitles(textTracks);
		setCurrentSubtitleIndex(textTracks.findIndex((track) => track.active));

		shakaRef.current = player;

		const loadedDataHandler = () => {
			if (video.readyState >= 2) {
				videoLoaded = true;
				setLoading(false);
			}
		}
		const settingLoadingTrue = () => {
			setLoading(true);
		};
		const settingLoadingFalse = () => {
			videoLoaded = true;
			setLoading(false);
		};
		video.onloadeddata = loadedDataHandler
		video.onwaiting = settingLoadingTrue;
		video.oncanplay = settingLoadingFalse;

		await new Promise((resolve, reject) => {
			setTimeout(() => {
				if (!videoLoaded) {
					reject(new Error('Timeout'))
				}
			}, timeout || 10000)
		})

	}, [])

	useEffect(() => {
		(async () => {
			const video = document.querySelector('video');
			window.shaka.polyfill.installAll(video);
			const player = new window.shaka.Player(video);

			const config = {
				abr: {
					enabled: true,
					switchInterval: 5,
				},
			}

if (isDRM) {
	if (drmType === 'widevine') {
		config.drm = {
			servers: {
				'com.widevine.alpha': drmLicenseKey
			}
		}
	} else if (drmType === 'playready') {
		config.drm = {
			servers: {
				'com.microsoft.playready': drmLicenseKey
			}
		}
	} else {
		throw new Error('Invalid DRM type. Only widevine and playready are supported.');
	}
}

			player.configure(config);
            loadVideo({player, video, url, timeout: 5000}).catch((error) => {
                setErrorInfo(error)
            })

		})();
	}, [url, isDRM, drmLicenseKey]);


	useEffect(() => {
		// After displaying the panels, move the focus to the main panel
		if (currentPanel) {
			Spotlight.focus('main-panel');
		}
	}, [currentPanel]);

	    
	useEffect(() => {
		// Back button handler
		const handleBackButton = (e) => {
			if (e.keyCode === 10009 || e.keyCode === 461) { // 10009 for Samsung, 461 for LG
				e.preventDefault();
				onBack();
			}
		};

		// Add event listener
		document.addEventListener('keydown', handleBackButton);

		// Cleanup
		return () => {
			document.removeEventListener('keydown', handleBackButton);
		};
	}, []);

	useEffect(() => {
		let counter = 0;
		const interval = setInterval(() => {
			if (!watermarkRef.current) return;
			if (counter % WATERMERK_SHOW_RATIO === 0) {
				const x = Math.random() * 90;
				const y = Math.random() * 90;
				watermarkRef.current.style.display = 'block';
				watermarkRef.current.style.left = `${5+x}vw`;
				watermarkRef.current.style.top = `${5+y}vh`;
			} else {
				watermarkRef.current.style.display = 'none';
			}
			counter++
		}, WATERMARK_SECONDS * 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	if (errorInfo) {
		return <PlayerErrorWithSpotlight errorInfo={errorInfo} />
	}

	return (
		<>
			<div className={css.PlayerPage}>
				<div className={isLive ? 'Live-player': ''}>
					<VideoPlayer
						ref={videoRef}
						spotlightDisabled={!!currentPanel}
						onBack={onBack}
						title={name || ''}
						seekDisabled={isLive}
						noSlider={isLive}
						noSpinner={true}
						jumpBy={15}
					>
						<source />
						<infoComponents>{description}</infoComponents>
						<MediaControls
							actionGuideLabel="Press Down Button"
							spotlightDisabled={!!currentPanel}
							jumpBackwardIcon="fifteenbackward"
							jumpForwardIcon="fifteenforward"
							noJumpButtons={isLive}
						>
							{!isLive && (
								<>
									<Button
									icon="gear"
									backgroundOpacity="transparent"
									onClick={handleQualityPanelOpen}
									spotlightDisabled={!!currentPanel}
									/>
									{audios.length > 1 && (
										<Button
											icon="browser"
											backgroundOpacity="transparent"
											onClick={handleAudioPanelOpen}
											spotlightDisabled={!!currentPanel}
										/>
									)}
									{!!subtitles.length && (
										<Button
											icon="subtitle"
											backgroundOpacity="transparent"
											onClick={handleSubtitlePanelOpen}
											spotlightDisabled={!!currentPanel}
										/>
									)}
								</>
							)}
							
						</MediaControls>
					</VideoPlayer>
					{currentPanel && (
						<Panels>
							{currentPanel === 'quality' && (
								<SelectPanel
									onHidePanels={onPanelClose}
									spotlightId="main-panel"
									defaultSelectedIndex={
										isAutoQuality
											? filteredQualities.length
											: currentQualityIndex
									}
									onSelect={onQualitySelect}
									options={[
										...filteredQualities.map((quality) =>
											getQualityLabel(quality)
										),
										'Auto'
									]}
									title="Select Video Quality"
								/>
							)}
							{currentPanel === 'audio' && (
								<SelectPanel
									onHidePanels={onPanelClose}
									spotlightId="main-panel"
									defaultSelectedIndex={currentAudioIndex}
									onSelect={onAudioSelect}
									options={audios.map((audio) => audio.language)}
									title="Select Audio"
								/>
							)}
							{currentPanel === 'subtitle' && (
								<SelectPanel
									onHidePanels={onPanelClose}
									spotlightId="main-panel"
									defaultSelectedIndex={currentSubtitleIndex}
									onSelect={({selected}) => {
										if (selected === 0) {
											shakaRef.current.setTextTrackVisibility(
												false
											)
											setCurrentSubtitleIndex(null)
										} else {
											shakaRef.current.selectTextTrack(
												subtitles[selected - 1],
												true
											)
											shakaRef.current.setTextTrackVisibility(
												true
											)
											setCurrentSubtitleIndex(selected)
										}
									}}
									options={[
										'Off',
										...subtitles.map(
											(subtitle) =>
												subtitle.language[0].toUpperCase() +
												subtitle.language.slice(1)
										)
									]}
									title="Select Subtitle"
								/>
							)}
						</Panels>
					)}
					<div className={css.WatermarkWrapper} ref={watermarkRef}>
						<BodyText ref={watermarkRef} className={css.Watermark}>{watermark}</BodyText>
					</div>
					{ loading && <Spinner className={css.PlayerSpinner} /> }
				</div>
			</div>
		</>
    )
}

export default Player