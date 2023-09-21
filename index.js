let videoInfo = [];

async function fetchPlaylistVideos(playlistURL){
    try {
        const response = await fetch(playlistURL);
        const body = await response.text();

        const ytInitialDataMatch = body.match(/var ytInitialData = (.*?);<\/script>/);
        const purse = JSON.parse(ytInitialDataMatch[1]);
        const contents = purse.contents.twoColumnWatchNextResults.playlist.playlist.contents;

        const currentVideoInfo = [];
        for (let i = 0; i < contents.length; i++) {
            const item = `https://youtu.be/${contents[i].playlistPanelVideoRenderer.videoId}`;
            currentVideoInfo.push(item);
        }
        videoInfo = [...videoInfo, ...currentVideoInfo];

        return { video: currentVideoInfo, vid: contents[24].playlistPanelVideoRenderer.videoId };

    } catch (error) {
        console.error("Error fetching the playlist:", error);
    }
}

async function fetchAllVideos(url) {
    const vMatch = url.match(/\?v=([^&]*)/);
    const listMatch = url.match(/&list=([^&]*)/);

    let allVideos = [];
    let increments = [1, 25, 49];
    let vid = vMatch[1]
    for (let i = 0; i < increments.length; i++) {
        const currentIndex = increments[i];
        console.log(currentIndex)
        const playlistURL = `https://youtube.com/watch?v=${vid}&list=${listMatch[1]}&index=${currentIndex}`;
        const videos = await fetchPlaylistVideos(playlistURL);
        allVideos = allVideos.concat(videos.video);
        vid = videos.vid
    }

    return videoInfo;
}

(async () => {
    const playlistBaseURL = "https://www.youtube.com/watch?v={vid}&list={listId}";
    const allVideos = await fetchAllVideos(playlistBaseURL);
    console.log(allVideos);
})();