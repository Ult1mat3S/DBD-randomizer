import { useEffect, useState } from "react";
import PerksCard from "./PerksCard";
import ThemeSwitch from "./themeSwitch.jsx";

function App() {
  const [perks, setPerks] = useState([]);
  const [perksArray, setPerksArray] = useState([]);
  const [allSurvivorPerks, setAllSurvivorPerks] = useState([]);
  const [allKillerPerks, setAllKillerPerks] = useState([]);
  const [killerPerks, setKillerPerks] = useState([]);
  const [survivorPerks, setSurvivorPerks] = useState([]);

  function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  function generateSurvivorPerks() {
    const randomSurvivorPerks = getRandomItems(allSurvivorPerks, 4);
    setSurvivorPerks(randomSurvivorPerks);
  }

  function generateKillerPerks() {
    const randomKillerPerks = getRandomItems(allKillerPerks, 4);
    setKillerPerks(randomKillerPerks);
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
        setKillerPerks(randomKillerPerks);
        setSurvivorPerks(randomSurvivorPerks);

        console.log(survivorPerks);
      })
      .catch((err) => console.error("Error loading perks:", err));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Random Perks</h1>
      <ThemeSwitch />
      <h2> Killer</h2>
      <PerksCard perks={killerPerks} />
      <button type="button" onClick={generateKillerPerks}>
        Generate
      </button>
      <h2>Survivor</h2>
      <PerksCard perks={survivorPerks} />
      <button type="button" onClick={generateSurvivorPerks}>
        Generate
      </button>
    </>
  );
}

export default App;
