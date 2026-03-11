import { useCallback, useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About.jsx";
import BuildsHistory from "./BuildsHistory.jsx";
import Contact from "./Contact.jsx";
import ObsSource from "./ObsSource.jsx";
import PerksCard from "./PerksCard";
import Settings from "./Settings.jsx";
import Support from "./Support.jsx";
import ThemeSwitch from "./ThemeSwitch.jsx";

const getRandomItems = (arr, n) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
};

const getRandomItem = (arr) => {
  const randomItemsArray = getRandomItems(arr, 1);

  const firstItem = randomItemsArray[0];

  return firstItem || null;
};

function App() {
  const [gameData, setGameData] = useState({
    killerPerks: [],
    survivorPerks: [],
    killerAddons: [],
    killerOfferings: [],
    survivorItems: [],
    survivorAddons: [],
    survivorOfferings: [],
    isLoaded: false,
  });

  const [killerLoadout, setKillerLoadout] = useState(null);
  const [survivorLoadout, setSurvivorLoadout] = useState(null);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const fetchAllData = async () => {
      const base = import.meta.env.BASE_URL;
      try {
        const [perksRes, killerItemsRes, survItemsRes, survAddonsRes, survOfferingsRes] = await Promise.all([
          fetch(`${base}perks.json`).then((res) => res.json()),
          fetch(`${base}killerItems.json`).then((res) => res.json()),
          fetch(`${base}survItems.json`).then((res) => res.json()),
          fetch(`${base}survAddons.json`).then((res) => res.json()),
          fetch(`${base}survOfferings.json`).then((res) => res.json()),
        ]);

        setGameData({
          killerPerks: perksRes.killer || [],
          survivorPerks: perksRes.survivor || [],
          killerAddons: killerItemsRes.addons || [],
          killerOfferings: killerItemsRes.offerings || [],
          survivorItems: survItemsRes.items || [],
          survivorAddons: survAddonsRes.addons || [],
          survivorOfferings: survOfferingsRes.offerings || [],
          isLoaded: true,
        });
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };

    fetchAllData();
  }, []);

  const generateKiller = useCallback(() => {
    if (!gameData.isLoaded) return;

    const character = getRandomItem(gameData.killerPerks.filter((k) => k.characterImage));
    const perks = getRandomItems(gameData.killerPerks, 4);
    const offering = getRandomItems(gameData.killerOfferings, 1);

    const fullKillerName = `The ${character?.character}`;
    const specificAddons = gameData.killerAddons.filter((a) => a.killer === fullKillerName);
    const addons = getRandomItems(specificAddons, 2);

    setKillerLoadout({ character, perks, addons, offering });
  }, [gameData]);

  const generateSurvivor = useCallback(() => {
    if (!gameData.isLoaded) return;

    const character = getRandomItem(gameData.survivorPerks.filter((s) => s.characterImage));
    const perks = getRandomItems(gameData.survivorPerks, 4);
    const item = getRandomItems(gameData.survivorItems, 1);
    const offering = getRandomItems(gameData.survivorOfferings, 1);

    const itemKey = item[0]?.itemKey;
    const specificAddons = gameData.survivorAddons.filter((a) => a.itemKey === itemKey);
    const addons = getRandomItems(specificAddons, 2);

    setSurvivorLoadout({ character, perks, item, addons, offering });
  }, [gameData]);

  useEffect(() => {
    if (gameData.isLoaded) {
      generateKiller();
      generateSurvivor();
    }
  }, [gameData.isLoaded, generateKiller, generateSurvivor]);

  return (
    <Router basename={`${import.meta.env.BASE_URL}`}>
      <div className="flex justify-between items-center"></div>
      <div className="flex justify-end items-right">
        <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="items-center text-center">
              <h1 className="text-2xl font-semibold mb-10">Dead By Daylight Randomizer</h1>
              {!gameData.isLoaded ? (
                <p>Loading data...</p>
              ) : (
                <>
                  {killerLoadout && (
                    <PerksCard
                      perks={killerLoadout.perks}
                      killer={killerLoadout.character}
                      killerAddons={killerLoadout.addons}
                      killerOffering={killerLoadout.offering}
                    />
                  )}
                  <button onClick={generateKiller} className="mb-20">
                    Generate Killer
                  </button>

                  {survivorLoadout && (
                    <PerksCard
                      perks={survivorLoadout.perks}
                      survivor={survivorLoadout.character}
                      survItem={survivorLoadout.item}
                      survivorAddons={survivorLoadout.addons}
                      survOffering={survivorLoadout.offering}
                    />
                  )}
                  <button onClick={generateSurvivor} className="mb-20">
                    Generate Survivor
                  </button>
                </>
              )}
              <div>
                Credit to the&nbsp;
                <a href="https://deadbydaylight.wiki.gg">Dead By Daylight Wiki</a>
                &nbsp;for the images and data
              </div>
              <a href="https://buymeacoffee.com/ult1mat3s"> Support ❤️</a> |{" "}
              <a href="https://github.com/Ult1mat3S/DBD-randomizer">GitHub</a>
            </div>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ObsSource" element={<ObsSource />} />
        <Route path="/BuildsHistory" element={<BuildsHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
