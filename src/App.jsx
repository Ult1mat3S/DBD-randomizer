import { useEffect, useState } from "react";
import PerksCard from "./PerksCard";
import Support from "./Support.jsx";
import ThemeSwitch from "./ThemeSwitch.jsx";

function App() {
  const [perksArray, setPerksArray] = useState([]);
  const [allSurvivorPerks, setAllSurvivorPerks] = useState([]);
  const [allKillerPerks, setAllKillerPerks] = useState([]);
  const [killerPerks, setKillerPerks] = useState([]);
  const [survivorPerks, setSurvivorPerks] = useState([]);
  const [randomKiller, setRandomKiller] = useState([]);
  const [randomSurvivor, setRandomSurvivor] = useState([]);
  const savedTheme = localStorage.getItem("theme");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  function generateSurvivorPerks() {
    const randomSurvivorPerks = getRandomItems(allSurvivorPerks, 4);
    setSurvivorPerks(randomSurvivorPerks);
    generateRandomSurvivor();
  }

  function generateKillerPerks() {
    const randomKillerPerks = getRandomItems(allKillerPerks, 4);
    setKillerPerks(randomKillerPerks);
    generateRandomKiller();
  }

  function generateRandomKiller() {
    const killers = allKillerPerks?.filter((k) => k.characterImage) || [];

    const killer = killers[Math.floor(Math.random() * killers.length)];
    setRandomKiller([killer]);
  }

  function generateRandomSurvivor() {
    const survivors = allSurvivorPerks?.filter((s) => s.characterImage) || [];

    const survivor = survivors[Math.floor(Math.random() * survivors.length)];
    setRandomSurvivor([survivor]);
  }

  useEffect(() => {
    // console.log(`${import.meta.env.BASE_URL}perks.json`);
    fetch(`${import.meta.env.BASE_URL}perks.json`)
      .then((res) => res.json())
      .then((data) => {
        const allPerks = [...data.killer, ...data.survivor];
        const survPerks = data.survivor;
        const killerPerks = data.killer;
        setPerksArray(allPerks);
        setAllKillerPerks(killerPerks);
        setAllSurvivorPerks(survPerks);
        const randomSurvivorPerks = getRandomItems(survPerks, 4);
        const randomKillerPerks = getRandomItems(killerPerks, 4);
        const randomKiller = getRandomItems(killerPerks, 1);
        const randomSurvivor = getRandomItems(survPerks, 1);
        setKillerPerks(randomKillerPerks);
        setSurvivorPerks(randomSurvivorPerks);
      })
      .catch((err) => console.error("Error loading perks:", err));
  }, []);

  useEffect(() => {
    if (allKillerPerks.length > 0) {
      generateRandomKiller();
    }
  }, [allKillerPerks]);

  useEffect(() => {
    if (allSurvivorPerks.length > 0) {
      generateRandomSurvivor();
    }
  }, [allSurvivorPerks]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4 ">Random Perks</h1>
        <Support darkMode={darkMode} />
        <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <h2> Killer</h2>
      <PerksCard perks={killerPerks} killer={randomKiller} />
      <button type="button" onClick={generateKillerPerks}>
        Generate
      </button>
      <h2>Survivor</h2>
      <PerksCard perks={survivorPerks} survivor={randomSurvivor} />
      <button type="button" onClick={generateSurvivorPerks}>
        Generate
      </button>
    </>
  );
}

export default App;
