import { PlaywrightCrawler, Dataset } from "crawlee";

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    // better way
    await page.waitForSelector("ytd-playlist-video-renderer");

    const videoDetails = await page.$$eval(
      "ytd-playlist-video-renderer",
      (videoDiv) => {
        const videoDetail = videoDiv.map((video) => {
          const videoTitle = video.querySelector(
            "div#content > div#container > div#meta > h3 > a#video-title"
          ).title;

          const videoThumbnail = video.querySelector(
            "div#content > div#container > ytd-thumbnail#thumbnail > a#thumbnail > yt-image > img"
          ).src;

          const result = {
            title: videoTitle,
            thumbnail: videoThumbnail,
          };

          return result;
        });
        return videoDetail;
      }
    );
    console.log(videoDetails);

    // will get the job done
    // await page.waitForSelector("a#video-title.yt-simple-endpoint");

    // const videoTitles = await page.$$eval(
    //   "a#video-title.yt-simple-endpoint",
    //   (els) => {
    //     return els.map((el) => el.title);
    //   }
    // );

    // const thumbnails = await page.$$eval(
    //   "ytd-thumbnail#thumbnail > a > yt-image > img.yt-core-image",
    //   (images) => {
    //     return images.map((image) => image.src);
    //   }
    // );

    // const pairedData = videoTitles.map((title, i) => ({
    //   title,
    //   thumbnail: thumbnails[i] || "N/A",
    // }));

    // pairedData.forEach(async (item, i) => {
    //   // console.log(`Title: ${item.title}, Thumbnail: ${item.thumbnail}`);
    //   await Dataset.pushData({
    //     title: item.title,
    //     thumbnail: item.thumbnail,
    //   });
    // });
  },
});

await crawler.run([
  "https://www.youtube.com/playlist?list=PLRD1Niz0lz1sfeX5UEGzkC3HJGpPOE96b",
]);