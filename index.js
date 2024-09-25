// Instead of CheerioCrawler let's use Playwright
// to be able to render JavaScript.
import { PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    await page.waitForSelector("a#video-title.yt-simple-endpoint");

    const videoTitle = await page.$$eval(
      "a#video-title.yt-simple-endpoint",
      (els) => {
        return els.map((el) => el.textContent);
      }
    );

    videoTitle.forEach((text, i) => {
      console.log(`CATEGORY_${i + 1}: ${text}\n`);
    });
  },
});

await crawler.run([
  "https://www.youtube.com/playlist?list=PLRD1Niz0lz1sfeX5UEGzkC3HJGpPOE96b",
]);
