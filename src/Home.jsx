import { useEffect, useState } from "react";

function Home() {
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
}

export default Home;
