import fs from "fs";
import he from "he";
import { JSDOM } from "jsdom";

function safeDecodeURIComponent(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function cleanDescription(desc) {
  if (!desc) return "";

  const urlDecoded = safeDecodeURIComponent(desc);
  const htmlDecoded = he.decode(urlDecoded);

  const dom = new JSDOM(htmlDecoded);
  const doc = dom.window.document;

  const selectorsToRemove = [".tooltiptext", ".mobileView", "style", "script"];
  selectorsToRemove.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((el) => el.remove());
  });

  ["p", "br", "li"].forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => {
      el.insertAdjacentText("beforebegin", "\n");
    });
  });

  ["ul", "ol"].forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => {
      el.insertAdjacentText("afterend", "\n");
    });
  });

  return doc.body.textContent
    .replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

function processData(inputPath, outputPath) {
  const rawData = fs.readFileSync(inputPath, "utf8");
  const data = JSON.parse(rawData);

  const categories = ["killer", "survivor", "addons", "offerings"];

  categories.forEach((category) => {
    if (data[category] && Array.isArray(data[category])) {
      data[category] = data[category].map((item) => {
        if (item.description) {
          item.description = cleanDescription(item.description);
        }
        return item;
      });
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Successfully cleaned ${inputPath} -> ${outputPath}`);
}

if (process.argv.length < 4) {
  console.log("Usage: node cleanItems.js input.json output.json");
} else {
  const [inputPath, outputPath] = process.argv.slice(2);
  processData(inputPath, outputPath);
}
