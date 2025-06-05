
export function getQualityLabel(quality) {
	switch(quality.height) {
		case 4320:
			return '8K UHD';
		case 2160:
			return '4K UHD';
		case 1440:
			return '2K';
		case 1080:
			return '1080P Full HD';
		case 720:
			return '720P HD';
		default:
			return quality.height + 'P';
	}
}


/**
 * Checks DRM support and content protection status
 * @param {Object} player - Shaka Player instance
 * @param {string} url - Content URL
 * @returns {Promise<Object>} DRM status and information
 */
export const checkDRMSupport = async (url) => {
    const videoEl = document.createElement('video');
    const player = new window.shaka.Player(videoEl);
    try {
        // Check browser DRM support first
        const drmSupport = await window.shaka.Player.probeSupport();
        const widevineSupport = drmSupport.drm['com.widevine.alpha'];
        const playreadySupport = drmSupport.drm['com.microsoft.playready'];
        const fairplaySupport = drmSupport.drm['com.apple.fps'];

        const supportedDRMs = {
            widevine: !!widevineSupport,
            playready: !!playreadySupport,
            fairplay: !!fairplaySupport
        };

        // If URL provided, check content protection
        let contentDRM = null;
        if (url && player) {
            try {
                await player.load(url);
                const drmInfo = player.drmInfo();
                
                if (drmInfo) {
                    contentDRM = {
                        isProtected: true,
                        keySystem: drmInfo.keySystem,
                        licenseServer: drmInfo.licenseServerUri,
                        distinctiveIdentifierRequired: drmInfo.distinctiveIdentifierRequired,
                        persistentStateRequired: drmInfo.persistentStateRequired,
                        audioRobustness: drmInfo.audioRobustness,
                        videoRobustness: drmInfo.videoRobustness,
                        initData: drmInfo.initData,
                    };
                } else {
                    contentDRM = {
                        isProtected: false
                    };
                }
            } catch (error) {
                contentDRM = {
                    isProtected: false,
                    error: {
                        code: error.code,
                        message: error.message,
                        severity: error.severity
                    }
                };
            }
        }

        return {
            browserSupport: {
                hasDRMSupport: Object.values(supportedDRMs).some(v => v),
                supportedSystems: supportedDRMs
            },
            contentProtection: contentDRM
        };
    } catch (error) {
        throw new Error(`DRM check failed: ${error.message}`);
    }
};

/*
{
    browserSupport: {
        hasDRMSupport: true,
        supportedSystems: {
            widevine: true,
            playready: false,
            fairplay: false
        }
    },
    contentProtection: {
        isProtected: true,
        keySystem: "com.widevine.alpha",
        licenseServer: "https://license.server.com/widevine",
        distinctiveIdentifierRequired: false,
        persistentStateRequired: false,
        audioRobustness: "SW_SECURE_CRYPTO",
        videoRobustness: "SW_SECURE_CRYPTO",
        initData: [...]
    }
}
*/

const drmKeys = {
    widevine: 'com.widevine.alpha',
    playready: 'com.microsoft.playready',
    fairplay: 'com.apple.fps'
}

export async function generateShakaDRMConfig(videoUrl) {
    const licenseId = /https:\/\/vz-6bcb56df-cd1.b-cdn.net\/(.*)\/playlist\.m3u8/.exec(videoUrl)?.[1];
    const drmStatus = await checkDRMSupport(videoUrl);
    const supportedDRM = Object.keys(drmStatus.browserSupport.supportedSystems).find(key => drmStatus.browserSupport.supportedSystems[key]);
    if (!drmStatus.browserSupport.hasDRMSupport || !supportedDRM) return null;
    return {
        servers: {
            [drmKeys[supportedDRM]]: `https://video.bunnycdn.com/WidevineLicense/210728/${licenseId}`
        }
    }
}

export function checkVideoReadyState(videoEl) {
    return new Promise((resolve, reject) => {
        if (videoEl.readyState === 2) resolve(true)
        let counter = 0;
        const interval = setInterval(() => {
            if (videoEl.readyState === 2) {
                clearInterval(interval)
                resolve(true)
            }
            counter++
            if (counter >= 10) {
                clearInterval(interval)
                reject(new Error('Timeout'))
            }
        }, 500)
    })
}
