import { PlaywrightCrawler, Dataset } from "crawlee";

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    await page.waitForSelector("a#video-title.yt-simple-endpoint");

    const videoTitles = await page.$$eval(
      "a#video-title.yt-simple-endpoint",
      (els) => {
        return els.map((el) => el.title);
      }
    );

    const thumbnails = await page.$$eval(
      "ytd-thumbnail#thumbnail > a > yt-image > img.yt-core-image",
      (images) => {
        return images.map((image) => image.src);
      }
    );

    const pairedData = videoTitles.map((title, i) => ({
      title,
      thumbnail: thumbnails[i] || "N/A",
    }));

    pairedData.forEach(async (item, i) => {
      // console.log(`Title: ${item.title}, Thumbnail: ${item.thumbnail}`);
      await Dataset.pushData({
        title: item.title,
        thumbnail: item.thumbnail,
      });
    });
  },
});

await crawler.run([
  "https://www.youtube.com/playlist?list=PLRD1Niz0lz1sfeX5UEGzkC3HJGpPOE96b",
]);

// below code is not working
// import { PlaywrightCrawler } from "crawlee";

// const crawler = new PlaywrightCrawler({
//   requestHandler: async ({ page, request, enqueueLinks }) => {
//     console.log(`Processing: ${request.url}`);
//     if (request.label === "VIDEO") {
//       // await page.waitForSelector("a#video-title.yt-simple-endpoint", {
//       //   timeout: 10000,
//       // });
//       // const title = await page
//       //   .locator("a#video-title.yt-simple-endpoint")
//       //   .innerText();
//       // console.log(`Title: ${title}`);
//       // console.log("Video found");
//       const title = await page
//         .locator(
//           "h3.style-scope.ytd-playlist-video-renderer > a#video-title.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer"
//         )
//         .textContent();
//       // console.log(await title.innerText());
//       console.log(title);
//     } else {
//       await page.waitForSelector(
//         "a#video-title.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer"
//       );

//       await enqueueLinks({
//         selector:
//           "a#video-title.yt-simple-endpoint.style-scope.ytd-playlist-video-renderer",
//         label: "VIDEO",
//       });
//     }
//   },
// });

// await crawler.run([
//   "https://www.youtube.com/playlist?list=PLRD1Niz0lz1sfeX5UEGzkC3HJGpPOE96b",
// ]);
