import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const ITEM_KEY_MAP = {
  "Med-Kit": "medkit",
  "Medkit": "medkit",

  "Toolbox": "toolbox",
  "Tool Box": "toolbox",

  "Flashlight": "flashlight",
  "Flash Light": "flashlight",

  "Map": "map",
  "Maps": "map",

  "Key": "key",
  "Keys": "key",
};

async function parseSurvivorItems(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const { document } = dom.window;

  const tables = document.querySelectorAll("table.wikitable");
  let results = [];

  tables.forEach((table) => {
    const rows = [...table.querySelectorAll("tbody tr")];

    rows.forEach((row) => {
      const cells = row.children;
      if (cells.length < 3) return;

      const nameElement = cells[1]?.querySelector("a");
      const imageElement = cells[0]?.querySelector("img");

      const itemName = nameElement?.textContent?.trim() || "";
      const rarity = cells[1]?.querySelector("div")?.textContent?.trim() || "";

      if (!itemName) return;
      if (row.textContent.includes("Retired")) return;
      if (rarity.includes("Event")) return;
      if (imageElement?.src.includes("IconHelp")) return;

      let rawSrc = imageElement?.getAttribute("src") || "";
      let cleanImg = "";

      if (rawSrc.includes("/thumb/")) {
        const noThumb = rawSrc.replace("/thumb", "");
        cleanImg = "https://deadbydaylight.wiki.gg" + noThumb.substring(0, noThumb.lastIndexOf("/"));
      } else {
        cleanImg = "https://deadbydaylight.wiki.gg" + rawSrc;
      }

      results.push({
        name: itemName,
        itemKey: ITEM_KEY_MAP[itemName] ?? itemName.toLowerCase(),
        image: cleanImg,
        rarity,
        description: cells[2].innerHTML.replaceAll("/wiki/", "https://deadbydaylight.wiki.gg/wiki/").trim(),
      });
    });
  });

  return results;
}

async function parseItemAddons(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const { document } = dom.window;

  let results = [];
  let currentItem = null;

  const content = document.querySelectorAll("h3, table.wikitable");

  content.forEach((el) => {
    if (el.tagName === "H3") {
      const name = el.querySelector(".mw-headline")?.textContent?.trim();
      if (name) currentItem = name;
    }

    if (!currentItem) return;

    if (el.tagName === "TABLE" && el.classList.contains("wikitable")) {
      const rows = [...el.querySelectorAll("tbody tr")];

      rows.forEach((row) => {
        const cells = row.children;
        if (cells.length < 3) return;

        const nameElement = cells[1]?.querySelector("a");
        const imageElement = cells[0]?.querySelector("img");

        const addonName = nameElement?.textContent?.trim() || "";
        const rarity = cells[1]?.querySelector("div")?.textContent?.trim() || "";

        if (!addonName) return;
        if (row.textContent.includes("Retired")) return;
        if (rarity.includes("Event")) return;
        if (imageElement?.src.includes("IconHelp")) return;

        let rawSrc = imageElement?.getAttribute("src") || "";
        let cleanImg = "";

        if (rawSrc.includes("/thumb/")) {
          const noThumb = rawSrc.replace("/thumb", "");
          cleanImg = "https://deadbydaylight.wiki.gg" + noThumb.substring(0, noThumb.lastIndexOf("/"));
        } else {
          cleanImg = "https://deadbydaylight.wiki.gg" + rawSrc;
        }

        results.push({
          name: addonName,
          item: currentItem,
          itemKey: ITEM_KEY_MAP[currentItem] ?? currentItem.toLowerCase(),
          image: cleanImg,
          rarity,
          description: cells[2].innerHTML.replaceAll("/wiki/", "https://deadbydaylight.wiki.gg/wiki/").trim(),
        });
      });
    }
  });

  return results;
}

(async function () {
  try {
    console.log("Processing Survivor Data...");

    const items = await parseSurvivorItems("https://deadbydaylight.wiki.gg/wiki/Items");

    const addons = await parseItemAddons("https://deadbydaylight.wiki.gg/wiki/Add-ons");

    writeFileSync("./survivorItems.json", JSON.stringify({ items, addons }, null, "\t"));

    console.log("Saved to survivorItems.json");
  } catch (err) {
    console.error(err);
  }
})();
