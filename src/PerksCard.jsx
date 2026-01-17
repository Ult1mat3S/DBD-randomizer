const hideNames = localStorage.getItem("hideOwnerNames");
// console.log(hideNames);

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
            width={512}
            height={512}
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
            width={160}
            height={160}
          />
        </div>
      )}

      <div className="flex gap-2 w-90 min-h-45">
        {perks.map((perk, index) => (
          <div key={index} className="flex flex-col p-1 items-center">
            {/* <p>{perk.character ?? "Universal Perk"}</p> */}
            <img
              src={perk.perkImage}
              alt={perk.perkName}
              className="w-16 h-16 object-contain hover:scale-110"
              title={perk.character ?? "Universal Perk"}
              width={64}
              height={64}
            />
            <div>{perk.perkName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerksCard;
