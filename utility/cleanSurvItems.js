import fs from "fs";

// Decode basic HTML entities
function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Convert HTML list structure to readable bullets
function normalizeLists(text) {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/ul>/gi, "\n");
}

// Strip all remaining HTML tags
function stripTags(text) {
  return text.replace(/<[^>]*>/g, "");
}

function cleanDescription(html) {
  if (!html) return html;

  let cleaned = html;

  cleaned = normalizeLists(cleaned);
  cleaned = stripTags(cleaned);
  cleaned = decodeEntities(cleaned);

  cleaned = cleaned
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  return cleaned;
}

function cleanSurvivorData(inputPath, outputPath) {
  try {
    const raw = fs.readFileSync(inputPath, "utf-8");
    const data = JSON.parse(raw);

    if (Array.isArray(data.items)) {
      data.items = data.items.map((item) => ({
        ...item,
        description: cleanDescription(item.description),
      }));
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Cleaned JSON written to: ${outputPath}`);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// CLI handling
if (process.argv.length < 4) {
  console.log("Usage: node cleanSurvAddons.js input.json output.json");
} else {
  const [inputPath, outputPath] = process.argv.slice(2);
  cleanSurvivorData(inputPath, outputPath);
}
