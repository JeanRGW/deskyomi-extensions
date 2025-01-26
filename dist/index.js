"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimeFire = void 0;
const cheerio = __importStar(require("cheerio"));
class AnimeFire {
    constructor() {
        this.baseUrl = "https://animefire.plus/";
        this.name = "Anime Fire";
        this.version = "1.0.0";
    }
    getAnimes(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield fetch(this.baseUrl);
            const html = yield resp.text();
            const doc = cheerio.load(html);
            const items = doc(".owl-carousel-home").children();
            const animes = items
                .map((i, el) => {
                const $el = cheerio.load(el); // Load the current element to use cheerio methods
                const anime = {
                    name: $el(".animeTitle").text() || "Not Found",
                    coverLink: $el("img").attr("data-src") || null,
                    link: $el("a").attr("href") || "google.com",
                };
                return anime;
            })
                .get();
            return animes;
        });
    }
    getEpisodes(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield fetch(link);
            const html = yield resp.text();
            const $ = cheerio.load(html);
            const list = $(".div_video_list").children();
            const eps = list
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
        });
    }
    getEpisode(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield fetch(link);
            const html = yield resp.text();
            const $ = cheerio.load(html);
            const qLinks = $("#my-video").attr("data-video-src");
            const qJson = yield (yield fetch(qLinks)).json();
            const qualities = qJson.data;
            return qualities[qualities.length - 1]["src"];
        });
    }
    search(str, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = "https://animefire.plus/pesquisar/" +
                str.toLowerCase().replace(/\s+/g, "-") +
                "/" +
                (index + 1);
            const resp = yield fetch(link);
            const html = yield resp.text();
            const $ = cheerio.load(html)("div.ml-1");
            const animes = $.children()
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
        });
    }
}
exports.AnimeFire = AnimeFire;
