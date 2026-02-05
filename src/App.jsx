import { useEffect, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PerksCard from "./PerksCard";
import Settings from "./Settings.jsx";
import ThemeSwitch from "./ThemeSwitch.jsx";

function App() {
  const [allSurvivorPerks, setAllSurvivorPerks] = useState([]);
  const [allKillerPerks, setAllKillerPerks] = useState([]);

  const [killerPerks, setKillerPerks] = useState([]);
  const [survivorPerks, setSurvivorPerks] = useState([]);

  const [killerAddons, setKillerAddons] = useState([]);
  const [killerOffering, setKillerOffering] = useState([]);

  const [survivorItem, setSurvivorItem] = useState([]);
  const [survivorAddons, setSurvivorAddons] = useState([]);
  const [survivorOffering, setSurvivorOffering] = useState([]);

  const [randomSurvivorItem, setRandomSurvivorItem] = useState([]);
  const [randomSurvivorAddons, setRandomSurvivorAddons] = useState([]);
  const [randomSurvivorOffering, setRandomSurvivorOffering] = useState([]);
  const [randomKillerAddons, setRandomKillerAddons] = useState([]);
  const [randomKillerOffering, setRandomKillerOffering] = useState([]);
  const [randomKiller, setRandomKiller] = useState(null);
  const [randomSurvivor, setRandomSurvivor] = useState(null);

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  function getRandomItems(arr, n) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
  }

  function generateRandomKiller() {
    const killers = allKillerPerks.filter((k) => k.characterImage);
    if (!killers.length) return;
    setRandomKiller(killers[Math.floor(Math.random() * killers.length)]);
  }

  function generateRandomSurvivor() {
    const survivors = allSurvivorPerks.filter((s) => s.characterImage);
    if (!survivors.length) return;
    setRandomSurvivor(survivors[Math.floor(Math.random() * survivors.length)]);
  }

  function generateKillerData() {
    setKillerPerks(getRandomItems(allKillerPerks, 4));
    generateRandomKiller();
    generateKillerAddonsAndOffering();
  }

  function generateSurvivorData() {
    setSurvivorPerks(getRandomItems(allSurvivorPerks, 4));
    generateRandomSurvivor();
    generateSurvivorItemsOfferingAndAddons();
  }

  function generateKillerAddonsAndOffering() {
    fetch(`${import.meta.env.BASE_URL}killerItems.json`)
      .then((res) => res.json())
      .then((data) => {
        setKillerAddons(data.addons);
        setKillerOffering(data.offerings);

        setRandomKillerAddons(getRandomItems(data.addons, 2));
        setRandomKillerOffering(getRandomItems(data.offerings, 1));
      })
      .catch(console.error);
  }

  function generateSurvivorItemsOfferingAndAddons() {
    const base = import.meta.env.BASE_URL;

    Promise.all([
      fetch(`${base}survItems.json`).then((res) => res.json()),
      fetch(`${base}survAddons.json`).then((res) => res.json()),
      fetch(`${base}survOfferings.json`).then((res) => res.json()),
    ])
      .then(([itemsData, addonsData, offeringsData]) => {
        setSurvivorItem(itemsData.items);
        setSurvivorAddons(addonsData.addons);
        setSurvivorOffering(offeringsData.offerings);

        const selectedItem = getRandomItems(itemsData.items, 1);
        setRandomSurvivorItem(selectedItem);

        const selectedOffering = getRandomItems(offeringsData.offerings, 1);
        setRandomSurvivorOffering(selectedOffering);

        const selectedAddons = getRandomItems(addonsData.addons, 2);
        setRandomSurvivorAddons(selectedAddons);
      })
      .catch((err) => console.error("Failed to fetch survivor data:", err));
  }

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}perks.json`)
      .then((res) => res.json())
      .then((data) => {
        setAllKillerPerks(data.killer);
        setAllSurvivorPerks(data.survivor);

        setKillerPerks(getRandomItems(data.killer, 4));
        setSurvivorPerks(getRandomItems(data.survivor, 4));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (allKillerPerks.length) generateRandomKiller();
    if (allSurvivorPerks.length) generateRandomSurvivor();
  }, [allKillerPerks, allSurvivorPerks]);

  useEffect(() => {
    if (!randomKiller || !killerAddons.length) return;
    const fullKillerName = `The ${randomKiller.character}`;
    const specificAddons = killerAddons.filter((addon) => addon.killer === fullKillerName);
    setRandomKillerAddons(getRandomItems(specificAddons, 2));
  }, [randomKiller, killerAddons, killerOffering]);

  useEffect(() => {
    if (!randomSurvivorItem?.length || !survivorAddons.length) return;

    const itemKey = randomSurvivorItem[0].itemKey;

    const specificAddons = survivorAddons.filter((addon) => addon.itemKey === itemKey);

    setRandomSurvivorAddons(getRandomItems(specificAddons, 2));
  }, [randomSurvivorItem, survivorAddons]);

  useEffect(() => {
    generateKillerAddonsAndOffering();
    generateSurvivorItemsOfferingAndAddons();
  }, []);

  return (
    <>
      <Router basename={`${import.meta.env.BASE_URL}`}>
        <div className="flex justify-between items-center">
          {/* <Link className="m-2" to="/settings">
            <button type="button">Settings</button>
          </Link> */}
        </div>
        <div className="flex justify-end items-right">
          <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div className="items-center text-center">
                <h1 className="text-2xl font-semibold mb-10">Dead By Daylight Randomizer</h1>
                <PerksCard
                  perks={killerPerks}
                  killer={randomKiller}
                  killerAddons={randomKillerAddons}
                  killerOffering={randomKillerOffering}
                />

                <button onClick={generateKillerData} className="mb-20">
                  Generate
                </button>

                <PerksCard
                  perks={survivorPerks}
                  survivor={randomSurvivor}
                  survItem={randomSurvivorItem}
                  survivorAddons={randomSurvivorAddons}
                  survOffering={randomSurvivorOffering}
                />
                <button onClick={generateSurvivorData} className="mb-20">
                  Generate
                </button>
              </div>
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
