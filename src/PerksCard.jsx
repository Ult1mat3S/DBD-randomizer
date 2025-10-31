import { useState } from "react";

function perksCard() {
  function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  const [perks, setPerks] = useState([]);

  <div className="flex flex-row flex-wrap gap-4  ">
    {perks.map((perk, index) => (
      <div key={index} className="flex flex-col items-center ">
        <img src={perk.perkImage} alt={perk.perkName} className="w-20 h-20" />

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
  </div>;
}

export default perksCard;
