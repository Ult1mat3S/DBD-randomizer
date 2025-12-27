import { useEffect, useState } from "react";
import PerksCard from "./PerksCard";
import ThemeSwitch from "./ThemeSwitch.jsx";

function App() {
  const [allSurvivorPerks, setAllSurvivorPerks] = useState([]);
  const [allKillerPerks, setAllKillerPerks] = useState([]);

  const [killerPerks, setKillerPerks] = useState([]);
  const [survivorPerks, setSurvivorPerks] = useState([]);

  const [randomKiller, setRandomKiller] = useState(null);
  const [randomSurvivor, setRandomSurvivor] = useState(null);

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  function getRandomItems(arr, n) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
  }

  function generateRandomKiller() {
    const killers = allKillerPerks.filter((k) => k.characterImage);
    setRandomKiller(killers[Math.floor(Math.random() * killers.length)]);
  }

  function generateRandomSurvivor() {
    const survivors = allSurvivorPerks.filter((s) => s.characterImage);
    setRandomSurvivor(survivors[Math.floor(Math.random() * survivors.length)]);
  }

  function generateKillerPerks() {
    setKillerPerks(getRandomItems(allKillerPerks, 4));
    generateRandomKiller();
  }

  function generateSurvivorPerks() {
    setSurvivorPerks(getRandomItems(allSurvivorPerks, 4));
    generateRandomSurvivor();
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
  }, [allKillerPerks]);

  useEffect(() => {
    if (allSurvivorPerks.length) generateRandomSurvivor();
  }, [allSurvivorPerks]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Random Perks</h1>
        <ThemeSwitch darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <h2 className="mt-2 mb-2">Killer</h2>
      <PerksCard perks={killerPerks} killer={randomKiller} />
      <button onClick={generateKillerPerks}>Generate</button>

      <h2 className="mt-2 mb-2">Survivor</h2>
      <PerksCard perks={survivorPerks} survivor={randomSurvivor} />
      <button onClick={generateSurvivorPerks}>Generate</button>
    </>
  );
}

export default App;
