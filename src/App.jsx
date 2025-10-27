import { useEffect, useState } from "react";

function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function App() {
  const [perks, setPerks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Theme toggle handler
  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", darkMode);
    html.classList.toggle("light", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    console.log(`${import.meta.env.BASE_URL}perks.json`);
    fetch(`${import.meta.env.BASE_URL}perks.json`)
      .then((res) => res.json())
      .then((data) => {
        const allPerks = [...data.killer, ...data.survivor];
        const randomPerks = getRandomItems(allPerks, 4);
        setPerks(randomPerks);
      })
      .catch((err) => console.error("Error loading perks:", err));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-red">Random Perks</h1>
      <div className="flex justify-end mx-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className={`${darkMode ? "bg-black" : "bg-white"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6 ${darkMode ? "hidden" : "block"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6  ${darkMode ? "block" : "hidden"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-row flex-wrap gap-4  ">
        {perks.map((perk, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={perk.perkImage} alt={perk.perkName} className=" w-20 h-20 " />

            <span className="text-sm text-center">{perk.perkName}</span>
            <br />
            {/* <div> {perk.description}</div> */}
            {perk.characterImage && (
              <img
                src={"https://deadbydaylight.wiki.gg" + perk.characterImage}
                // src={"https://deadbydaylight.wiki.gg" + perk.characterImage}
                alt={perk.character}
                className=""
              />
            )}

            <p>{perk.character}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
