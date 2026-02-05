import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";

const NOT_BLOODWEB_KEYWORDS = [
  "no longer be obtained",
  "only available during",
  "event",
  "lunar",
  "anniversary",
  "halloween",
  "retired",
  "deprecated",
  "vaccine",
  "lantern",
  "firecracker",
  "special event",
];

const KILLER_KEYWORDS = ["playing as", "killer", "killer power", "power button", "tokens", "rush", "the blight"];

function fullyDecode(text = "") {
  let prev;
  let curr = text;

  do {
    prev = curr;
    try {
      curr = decodeURIComponent(curr);
    } catch {
      break;
    }
  } while (curr !== prev);

  return curr;
}

function cleanDescriptionHTML(html = "") {
  const decoded = fullyDecode(html);
  const dom = new JSDOM(`<body>${decoded}</body>`);
  const { document } = dom.window;

  document
    .querySelectorAll("img, span, sup, sub, style, script, .iconLink, .tooltip, .mobileView")
    .forEach((el) => el.remove());

  document.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));

  document.querySelectorAll("li").forEach((li) => {
    li.textContent = `• ${li.textContent}`;
  });

  let text = document.body.textContent || "";

  return text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function containsAny(text, words) {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

function cleanSurvivorData(inputPath, outputPath) {
  const raw = JSON.parse(readFileSync(inputPath, "utf8"));

  const cleanedItems = raw.items
    .map((item) => ({
      ...item,
      description: cleanDescriptionHTML(item.description),
    }))
    .filter((item) => item.description.length > 0 && !containsAny(item.description, NOT_BLOODWEB_KEYWORDS));

  const validItemKeys = new Set(cleanedItems.map((i) => i.itemKey));

  const cleanedAddons = raw.addons
    .map((addon) => ({
      ...addon,
      description: cleanDescriptionHTML(addon.description),
    }))
    .filter(
      (addon) =>
        validItemKeys.has(addon.itemKey) &&
        !containsAny(addon.description, NOT_BLOODWEB_KEYWORDS) &&
        !containsAny(addon.description, KILLER_KEYWORDS),
    );

  writeFileSync(
    outputPath,
    JSON.stringify(
      {
        items: cleanedItems,
        addons: cleanedAddons,
      },
      null,
      "\t",
    ),
  );

  console.log("Data cleaned");
}

if (process.argv.length < 4) {
  console.log("Usage: node cleanSurvAddons.js input.json output.json");
} else {
  const [inputPath, outputPath] = process.argv.slice(2);
  cleanSurvivorData(inputPath, outputPath);
}
