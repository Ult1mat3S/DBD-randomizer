import { readFileSync } from "fs";

// Utility to pick `n` random items from an array
function pickRandom(array, n) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function pickPerks() {
  const data = JSON.parse(readFileSync("perks.json", "utf-8"));

  // Combine killer and survivor perks into one array if you want both
  const allPerks = [...data.killer, ...data.survivor];

  const selectedPerks = pickRandom(allPerks, 3);

  selectedPerks.forEach((perk, i) => {
    console.log(`\n🎯 Perk #${i + 1}`);
    console.log(`Name: ${perk.perkName}`);
    console.log(`Character: ${perk.character}`);
    console.log(`Image: ${perk.perkImage}`);
    console.log(`Description (encoded): ${perk.description}`);
  });
}

pickPerks();
