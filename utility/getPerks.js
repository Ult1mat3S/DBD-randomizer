// https://github.com/MrTipson/otz-builds/blob/master/build/getPerks.js

import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";

// Parse perks from the wikipedia perk tables
async function parsePerks(url) {
  const stuff = await axios.get(url);
  const dom = new JSDOM(stuff.data);
  const { document } = dom.window;
  // Grab all rows in table
  const perks = [...document.querySelector("tbody").children].map((x) => {
    x.children[2].querySelectorAll(".iconLink").forEach((y) => y.remove());
    const imageElement = x.children[0].querySelector("img");
    const imageUrl = imageElement?.src.substring(0, imageElement.src.lastIndexOf("/")).replace("/thumb", "");
    return {
      perkImage: "https://deadbydaylight.wiki.gg" + imageUrl,
      perkName: imageElement?.alt,
      description: encodeURI(x.children[2].innerHTML.replaceAll("/wiki/", "https://deadbydaylight.wiki.gg/wiki/")),
      character: x.children[3].querySelector("a")?.title,
      characterImage: x.children[3].querySelector("img")?.src,
    };
  });
  // Sort so binary search can be used
  perks.sort(function (a, b) {
    return a.perkName.localeCompare(b.perkName, "en");
  });
  return perks;
}

(async function () {
  // Grab webpage
  let perks = {
    killer: await parsePerks("https://deadbydaylight.wiki.gg/wiki/Killer_Perks"),
    survivor: await parsePerks("https://deadbydaylight.wiki.gg/wiki/Survivor_Perks"),
  };
  // Write back into file
  writeFileSync("./perks.json", JSON.stringify(perks, null, "\t"));
})();
