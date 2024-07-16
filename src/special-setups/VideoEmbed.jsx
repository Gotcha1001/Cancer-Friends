import React from 'react';

const VideoEmbed = ({ videoUrl }) => {
    let embedUrl = '';

    // Check if the URL is a YouTube URL and transform it into an embed URL
    if (videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('/').pop().split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtube.com')) {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        const videoId = urlParams.get('v');
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('fb.watch')) {
        // Assuming we have a way to convert fb.watch URL to full Facebook video URL
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=734`;
    } else if (videoUrl.includes('facebook.com')) {
        // Handle direct Facebook video URL
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=734`;
    } else {
        // Fallback to the original URL for other video types
        embedUrl = videoUrl;
    }

    return (
        <div className="video-container">
            <iframe
                src={embedUrl}
                width="734"
                height="413"
                style={{ border: 'none', overflow: 'hidden' }}
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
        </div>
    );
};

export default VideoEmbed;
