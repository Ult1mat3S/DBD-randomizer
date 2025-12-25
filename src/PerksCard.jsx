function PerksCard({ perks, killer, survivor }) {
  return (
    <>
      <div className="flex flex-row flex-grow gap-4 justify-center text-center">
        {killer && killer[0]?.characterImage && (
          <div id="killer-name">
            <p className="text-center">{killer[0]?.character}</p>
            <img
              src={"https://deadbydaylight.wiki.gg" + killer[0]?.characterImage}
              alt={killer[0]?.character}
              className="w-40 md:w-36 lg:w-40 flex flex-row items-center"
            />
          </div>
        )}

        {survivor && survivor[0]?.characterImage && (
          <div id="survivor-name">
            <p className="text-center"> {survivor[0]?.character}</p>
            <img
              src={"https://deadbydaylight.wiki.gg" + survivor[0]?.characterImage}
              alt={survivor[0]?.character}
              className="w-40 md:w-32 lg:w-40 flex flex-row"
            />
          </div>
        )}

        {perks.map((perk, index) => (
          <div key={index} className="flex flex-col items-center">
            {perk.character && <p id="character-name">{perk.character}</p>}
            <div>
              <img src={perk.perkImage} alt={perk.perkName} className="w-16 md:w-20 lg:w-20  hover:scale-110" />
              <span>{perk.perkName}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PerksCard;
