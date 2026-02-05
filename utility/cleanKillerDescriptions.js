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
  const urlDecoded = safeDecodeURIComponent(desc);

  const htmlDecoded = he.decode(urlDecoded);

  const dom = new JSDOM(htmlDecoded);
  const doc = dom.window.document;

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

  return doc.body.textContent.replace(/\n\s*\n/g, "\n").trim();
}

function cleanPerks(inputPath, outputPath) {
  const rawData = fs.readFileSync(inputPath, "utf8");
  const data = JSON.parse(rawData);

  ["killer", "survivor"].forEach((category) => {
    if (data[category]) {
      data[category] = data[category].map((perk) => {
        if (perk.description) {
          perk.description = cleanDescription(perk.description);
        }
        return perk;
      });
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`Cleaned perks saved to ${outputPath}`);
}

if (process.argv.length < 4) {
  console.log("Usage: node cleanDescriptions.js input.json output.json");
} else {
  const [inputPath, outputPath] = process.argv.slice(2);
  cleanPerks(inputPath, outputPath);
}
