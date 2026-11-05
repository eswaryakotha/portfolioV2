/** Case studies whose hero video plays once instead of looping: from VIDEO_START each time
    it comes into view (and from the book's zoom), holding its last frame at the end. */
export const PLAY_ONCE_HEROES = ["metamint", "dolby-labs"];

/** Where those hero videos start (seconds). Not quite 0: the clips hold their opening
    frame for a moment, which reads as a still placeholder. */
export const VIDEO_START = 0.4;

export const playsOnce = (slug: string) => PLAY_ONCE_HEROES.includes(slug);
