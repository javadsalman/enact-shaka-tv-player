import Player from '../container/Player/Player';

const HLS_VIDEO_URL = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls-apple/master.m3u8"
const HLS_LIVE_URL = "https://storage.googleapis.com/shaka-live-assets/player-source.m3u8"
const WIDEVINE_VIDEO_URL = "https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine-hls/hls.m3u8"
const WIDEVINE_LICENSE_URL = "https://cwip-shaka-proxy.appspot.com/no_auth"

function PlayerPage({setPage}) {
    const url = HLS_VIDEO_URL
    const name = "Istintaq"
    const description = "Istintaq"
    const isDRM = false
    const drmLicenseKey = null
    const watermark = "I'M WATERMARK"
    return (
        <Player url={url} name={name} description={description} isDRM={isDRM} drmLicenseKey={drmLicenseKey} watermark={watermark} onBack={() => setPage('navigation')} />
    );
}

export default PlayerPage;