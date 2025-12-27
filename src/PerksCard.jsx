function PerksCard({ perks, killer, survivor }) {
  return (
    <div className="flex flex-col p-1 items-center text-center">
      {killer?.characterImage && (
        <div className="mb-4">
          <p>{killer.character}</p>
          <img
            src={`https://deadbydaylight.wiki.gg${killer.characterImage}`}
            alt={killer.character}
            className="w-40 object-contain block"
          />
        </div>
      )}

      {survivor?.characterImage && (
        <div className="mb-4">
          <p>{survivor.character}</p>
          <img
            src={`https://deadbydaylight.wiki.gg${survivor.characterImage}`}
            alt={survivor.character}
            className="w-40 object-contain block"
          />
        </div>
      )}

      <div className="flex gap-2">
        {perks.map((perk, index) => (
          <div key={index} className="flex flex-col p-1 items-center">
            <p>{perk.character ?? "Universal Perk"}</p>
            <img src={perk.perkImage} alt={perk.perkName} className="w-16 h-16 object-contain hover:scale-110" />
            <span>{perk.perkName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerksCard;
