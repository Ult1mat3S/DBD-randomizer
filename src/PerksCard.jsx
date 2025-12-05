function PerksCard({ perks }) {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {perks.map((perk, index) => (
        <div key={index} className="flex flex-col items-center">
          {perk.characterImage && (
            <img
              className="character-img"
              src={"https://deadbydaylight.wiki.gg" + perk.characterImage}
              alt={perk.character}
            />
          )}
          {perk.character && <p className="character-name"> {perk.character}</p>}
          {/* TODO: fix styling when there is a universal perk because there's no character image */}
          <img src={perk.perkImage} alt={perk.perkName} className="perk-img w-20 h-20" />
          <span className="text-center">{perk.perkName}</span>
        </div>
      ))}
    </div>
  );
}

export default PerksCard;
