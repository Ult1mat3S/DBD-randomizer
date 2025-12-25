import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const BASE = "https://deadbydaylight.wiki.gg";

/* =========================
   DATA CLEANING
========================= */

const NAME_BLACKLIST = [
  // Mobile
  "Wooden Chalice",
  "Golden Chalice",

  // Trial-only
  "Vaccine",
  "T-Virus Vaccine",
  "EMP",
  "Signal Jammer",

  // Lore / meta
  "Benedict Baker",
  "Achievements",

  // Event / misc
  "Invitation",
  "Snowman",
  "Spray Can",
];

function cleanName(name) {
  if (!name) return null;

  return (
    name
      // Remove file extensions
      .replace(/\.(png|webp|jpg|jpeg)$/i, "")

      // Remove wiki UI junk
      .replace(/IconHelp/gi, "")
      .replace(/IconFavors/gi, "")
      .replace(/IconItems/gi, "")

      // Convert underscores to spaces
      .replace(/_/g, " ")

      // Normalize spacing
      .replace(/\s+/g, " ")
      .trim()
  );
}

function isBlacklistedByName(name) {
  if (!name) return true;
  return NAME_BLACKLIST.some((bad) => name.toLowerCase().includes(bad.toLowerCase()));
}

function isBloodwebAvailable(row) {
  const text = row.textContent.toLowerCase();

  return (
    !text.includes("decommissioned") &&
    !text.includes("unused") &&
    !text.includes("event") &&
    !text.includes("trial") &&
    !text.includes("mobile") &&
    !text.includes("cannot be obtained") &&
    !text.includes("not available") &&
    !text.includes("achievement")
  );
}

function normalizeImage(img) {
  if (!img?.src) return null;

  const src = img.src.replace("/thumb", "");
  const cut = src.lastIndexOf("/");

  return BASE + (cut === -1 ? src : src.substring(0, cut));
}

/* =========================
   GENERIC TABLE PARSER
========================= */

async function parseTable(url, nameKey, imageKey) {
  const res = await axios.get(url);
  const dom = new JSDOM(res.data);
  const { document } = dom.window;

  return [...document.querySelectorAll("tbody tr")]
    .filter(isBloodwebAvailable)
    .map((row) => {
      const img = row.querySelector("img");
      const linkTitle = row.querySelector("a")?.getAttribute("title");

      const name = cleanName(linkTitle || img?.alt);
      if (isBlacklistedByName(name)) return null;

      return {
        [imageKey]: normalizeImage(img),
        [nameKey]: name,

        // IMPORTANT: DO NOT encode this
        description: row.children[row.children.length - 1].innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a[nameKey].localeCompare(b[nameKey], "en"));
}

/* =========================
   KILLER ADDONS
========================= */

async function parseKillerAddons() {
  const res = await axios.get(`${BASE}/wiki/Killers`);
  const dom = new JSDOM(res.data);
  const killerLinks = [...dom.window.document.querySelectorAll(".gallerybox a")].map(
    (a) => BASE + a.getAttribute("href")
  );

  const output = [];

  for (const url of killerLinks) {
    const page = await axios.get(url);
    const dom2 = new JSDOM(page.data);
    const { document } = dom2.window;

    const killerName = cleanName(document.querySelector("h1")?.textContent);

    const addonTable = document.querySelector("#Add-ons")?.closest("h2")?.nextElementSibling;

    if (!addonTable) continue;

    const addons = [...addonTable.querySelectorAll("tr")]
      .slice(1)
      .filter(isBloodwebAvailable)
      .map((row) => {
        const img = row.querySelector("img");
        const linkTitle = row.querySelector("a")?.getAttribute("title");

        const name = cleanName(linkTitle || img?.alt);
        if (isBlacklistedByName(name)) return null;

        return {
          addonImage: normalizeImage(img),
          addonName: name,
          description: row.children[row.children.length - 1].innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.addonName.localeCompare(b.addonName, "en"));

    if (addons.length) {
      output.push({ killer: killerName, addons });
    }
  }

  return output;
}

/* =========================
   SURVIVOR ITEM ADDONS
========================= */

async function parseSurvivorAddons() {
  const res = await axios.get(`${BASE}/wiki/Items`);
  const dom = new JSDOM(res.data);
  const itemLinks = [...dom.window.document.querySelectorAll(".gallerybox a")].map(
    (a) => BASE + a.getAttribute("href")
  );

  const output = [];

  for (const url of itemLinks) {
    const page = await axios.get(url);
    const dom2 = new JSDOM(page.data);
    const { document } = dom2.window;

    const itemName = cleanName(document.querySelector("h1")?.textContent);

    if (isBlacklistedByName(itemName)) continue;

    const addonTable = document.querySelector("#Add-ons")?.closest("h2")?.nextElementSibling;

    if (!addonTable) continue;

    const addons = [...addonTable.querySelectorAll("tr")]
      .slice(1)
      .filter(isBloodwebAvailable)
      .map((row) => {
        const img = row.querySelector("img");
        const linkTitle = row.querySelector("a")?.getAttribute("title");

        const name = cleanName(linkTitle || img?.alt);
        if (isBlacklistedByName(name)) return null;

        return {
          addonImage: normalizeImage(img),
          addonName: name,
          description: row.children[row.children.length - 1].innerHTML.replaceAll("/wiki/", `${BASE}/wiki/`),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.addonName.localeCompare(b.addonName, "en"));

    if (addons.length) {
      output.push({ item: itemName, addons });
    }
  }

  return output;
}

/* =========================
   MAIN
========================= */

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

  writeFileSync("../inventory.json", JSON.stringify(data, null, "\t"));

  console.log("✔ Lobby-valid inventory generated (no lore, no achievements)");
})();
