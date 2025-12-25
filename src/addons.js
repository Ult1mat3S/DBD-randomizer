import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const BASE = "https://deadbydaylight.wiki.gg";

/**
 * Helper: remove decommissioned / unused rows
 */
function isActiveRow(row) {
  const text = row.textContent.toLowerCase();
  return !text.includes("decommissioned") && !text.includes("unused");
}

/**
 * Helper: normalize wiki image URLs
 */
function normalizeImage(img) {
  if (!img?.src) return null;
  return BASE + img.src.replace("/thumb", "").substring(0, img.src.lastIndexOf("/"));
}

/**
 * Generic table parser
 */
async function parseTable(url, nameKey, imageKey) {
  const res = await axios.get(url);
  const dom = new JSDOM(res.data);
  const { document } = dom.window;

  const rows = [...document.querySelectorAll("tbody tr")].filter(isActiveRow);

  return rows
    .map((row) => {
      const img = row.querySelector("img");
      const descCell = row.children[row.children.length - 1];

      return {
        [imageKey]: normalizeImage(img),
        [nameKey]: img?.alt?.trim(),
        description: encodeURI(descCell.innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`)),
      };
    })
    .sort((a, b) => a[nameKey]?.localeCompare(b[nameKey], "en"));
}

/**
 * Killer Addons (per killer page)
 */
async function parseKillerAddons() {
  const res = await axios.get(`${BASE}/wiki/Killers`);
  const dom = new JSDOM(res.data);
  const killers = [...dom.window.document.querySelectorAll(".gallerybox a")].map((a) => BASE + a.getAttribute("href"));

  const output = [];

  for (const killerUrl of killers) {
    const page = await axios.get(killerUrl);
    const dom2 = new JSDOM(page.data);
    const { document } = dom2.window;

    const killerName = document.querySelector("h1")?.textContent;

    const addonTable = document.querySelector("#Add-ons")?.closest("h2")?.nextElementSibling;
    if (!addonTable) continue;

    const addons = [...addonTable.querySelectorAll("tr")]
      .filter(isActiveRow)
      .slice(1)
      .map((row) => {
        const img = row.querySelector("img");
        return {
          addonImage: normalizeImage(img),
          addonName: img?.alt,
          description: encodeURI(row.children[row.children.length - 1].innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`)),
        };
      });

    output.push({ killer: killerName, addons });
  }

  return output;
}

/**
 * Survivor Item Addons
 */
async function parseSurvivorAddons() {
  const res = await axios.get(`${BASE}/wiki/Items`);
  const dom = new JSDOM(res.data);
  const items = [...dom.window.document.querySelectorAll(".gallerybox a")].map((a) => BASE + a.getAttribute("href"));

  const output = [];

  for (const itemUrl of items) {
    const page = await axios.get(itemUrl);
    const dom2 = new JSDOM(page.data);
    const { document } = dom2.window;

    const itemName = document.querySelector("h1")?.textContent;

    const addonTable = document.querySelector("#Add-ons")?.closest("h2")?.nextElementSibling;
    if (!addonTable) continue;

    const addons = [...addonTable.querySelectorAll("tr")]
      .filter(isActiveRow)
      .slice(1)
      .map((row) => {
        const img = row.querySelector("img");
        return {
          addonImage: normalizeImage(img),
          addonName: img?.alt,
          description: encodeURI(row.children[row.children.length - 1].innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`)),
        };
      });

    output.push({ item: itemName, addons });
  }

  return output;
}

/**
 * MAIN
 */
(async function () {
  const data = {
    killer: {
      offerings: await parseTable(`${BASE}/wiki/Offerings`, "offeringName", "offeringImage"),
      addons: await parseKillerAddons(),
    },
    survivor: {
      offerings: await parseTable(`${BASE}/wiki/Offerings`, "offeringName", "offeringImage"),
      items: await parseTable(`${BASE}/wiki/Items`, "itemName", "itemImage"),
      addons: await parseSurvivorAddons(),
    },
  };

  writeFileSync("../items-addons-offerings.json", JSON.stringify(data, null, "\t"));
})();
