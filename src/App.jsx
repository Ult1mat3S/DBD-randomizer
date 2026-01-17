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
    if (allSurvivorPerks.length) generateRandomSurvivor();
  }, [allKillerPerks, allSurvivorPerks]);

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
                <h1 className="text-2xl font-semibold mb-10 ">Dead By Daylight Randomizer</h1>
                <PerksCard perks={killerPerks} killer={randomKiller} />
                <button onClick={generateKillerPerks} className="mb-20">
                  Generate
                </button>

                <PerksCard perks={survivorPerks} survivor={randomSurvivor} />
                <button onClick={generateSurvivorPerks} className="mb-20">
                  Generate
                </button>
              </div>
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>

      <footer className="text-center m-2">
        Made by <a href="https://github.com/Ult1mat3S">Ultimate</a> |
        <a href="https://github.com/Ult1mat3S/DBD-randomizer"> Github Repo</a>
      </footer>
    </>
  );
}

export default App;
