export type EpisodeEntry = {
    index: number;
    name: string;
    link: string;
};

export type AnimeEntry = {
    name: string;
    link: string;
    coverLink: string | null;
};

export interface Extension {
    readonly name: string;
    readonly version: string;
    readonly baseUrl: string;

    /**
     * @param page Page index for offset in dynamic load, default 0
     */
    getAnimes(pageOffset: number): Promise<AnimeEntry[]>;

    /**
     *
     * @param link Specific anime page link
     */
    getEpisodes(link: string): Promise<EpisodeEntry[]>;

    /**
     *
     * @param link Specific episode page link
     * @returns Direct video link to episode
     */
    getEpisode(link: string): Promise<string>;

    /**
     *
     * @param str Name for search on website
     * @param index Index offset for dynamic load, default 0
     */
    search(str: string, pageOffset: number): Promise<AnimeEntry[]>;
}
