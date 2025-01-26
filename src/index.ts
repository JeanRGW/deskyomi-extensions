import { AnimeEntry, EpisodeEntry, Extension } from "./types/extension.js";
import * as cheerio from "cheerio";

class AnimeFire implements Extension {
    baseUrl = "https://animefire.plus/";
    name = "Anime Fire";
    version = "1.0.0";

    async getAnimes(page: number): Promise<AnimeEntry[]> {
        const resp = await fetch(this.baseUrl);
        const html = await resp.text();

        const doc = cheerio.load(html);

        const items = doc(".owl-carousel-home").children();

        const animes: AnimeEntry[] = items
            .map((i, el) => {
                const $el = cheerio.load(el); // Load the current element to use cheerio methods

                const anime: AnimeEntry = {
                    name: $el(".animeTitle").text() || "Not Found",
                    coverLink: $el("img").attr("data-src") || null,
                    link: $el("a").attr("href") || "google.com",
                };

                return anime;
            })
            .get();

        return animes;
    }

    async getEpisodes(link: string): Promise<EpisodeEntry[]> {
        const resp = await fetch(link);
        const html = await resp.text();

        const $ = cheerio.load(html);
        const list = $(".div_video_list").children();

        const eps: EpisodeEntry[] = list
            .map((i, el) => {
                const $el = cheerio.load(el);

                return {
                    name: `Episódio ${i + 1}`,
                    index: i + 1,
                    link: $el("a").attr("href") || "google.com",
                };
            })
            .get();

        return eps;
    }

    async getEpisode(link: string): Promise<string> {
        const resp = await fetch(link);
        const html = await resp.text();

        const $ = cheerio.load(html);

        const qLinks = $("#my-video").attr("data-video-src") as string;
        const qJson = await (await fetch(qLinks)).json();
        const qualities: [] = qJson.data;
        return qualities[qualities.length - 1]["src"];
    }

    async search(str: string, index: number): Promise<AnimeEntry[]> {
        const link =
            "https://animefire.plus/pesquisar/" +
            str.toLowerCase().replace(/\s+/g, "-") +
            "/" +
            (index + 1);

        const resp = await fetch(link);
        const html = await resp.text();

        const $ = cheerio.load(html)("div.ml-1");

        const animes: AnimeEntry[] = $.children()
            .map((i, el) => {
                const $el = cheerio.load(el);

                return {
                    link: $el("a").attr("href") || "Not Found",
                    name: $el(".animeTitle").text() || "Not Found",
                    coverLink: $el("img").attr("data-src") || "Not Found",
                };
            })
            .get();

        return animes;
    }
}

export { AnimeFire };
