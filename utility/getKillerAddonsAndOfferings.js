import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";

async function parseAddons(url) {
  const response = await axios.get(url);
  const dom = new JSDOM(response.data);
  const { document } = dom.window;

  let results = [];
  const content = document.querySelectorAll("h2, h3, p, table.wikitable");
  let currentKiller = "Universal";

  content.forEach((el) => {
    if (el.tagName === "H2") {
      const h2Name = el.querySelector(".mw-headline")?.textContent?.trim();
      if (h2Name && !["Add-ons", "Navigation", "Technical Rollback"].includes(h2Name)) {
        currentKiller = h2Name;
      }
    }

    if (el.tagName === "P") {
      const text = el.textContent;
      if (text.includes("is the Power of")) {
        const match = text.match(/is the Power of\s+(the\s+[\w\s]+)/i);
        if (match && match[1]) {
          currentKiller = match[1].split(".")[0].trim();
        }
      }
    }

    if (el.tagName === "TABLE" && el.classList.contains("wikitable")) {
      const rows = [...el.querySelectorAll("tbody tr")];

      rows.forEach((row) => {
        const cells = row.children;
        if (cells.length < 3) return;

        const nameElement = cells[1]?.querySelector("a");
        const imageElement = cells[0]?.querySelector("img");
        const itemName = nameElement?.textContent?.trim() || "";
        const rarity = cells[1]?.querySelector("div")?.textContent?.trim() || "";

        if (!itemName || row.textContent.includes("Retired") || rarity.includes("Event")) return;

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
          killer: currentKiller,
          image: cleanImg,
          rarity: rarity,
          description: encodeURI(
            cells[2].innerHTML.replaceAll("/wiki/", "https://deadbydaylight.wiki.gg/wiki/").trim(),
          ),
        });
      });
    }
  });

  return results;
}

async function parseOfferings(url) {
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

      if (!itemName || row.textContent.includes("Retired") || rarity.includes("Event") || rarity === "Common") return;
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
        image: cleanImg,
        rarity: rarity,
        description: encodeURI(cells[2].innerHTML.replaceAll("/wiki/", "https://deadbydaylight.wiki.gg/wiki/").trim()),
      });
    });
  });

  return results;
}

(async function () {
  try {
    console.log("Processing Data...");
    const addons = await parseAddons("https://deadbydaylight.wiki.gg/wiki/Add-ons");
    const offerings = await parseOfferings("https://deadbydaylight.wiki.gg/wiki/Offerings");

    const data = {
      addons,
      offerings: offerings.filter((o) => {
        const d = decodeURI(o.description).toLowerCase();
        return !d.includes("survivor") || d.includes("all players") || d.includes("killer");
      }),
    };

    writeFileSync("./killerItems.json", JSON.stringify(data, null, "\t"));
    console.log(`Saved to killerItems.json`);
  } catch (error) {
    console.error(error);
  }
})();
