function PerksCard({ perks, killer, survivor, killerAddons, killerOffering, survItem, survOffering, survivorAddons }) {
  return (
    <div className="flex flex-col p-1 items-center text-center">
      {killerOffering &&
        killerOffering.map((offering, i) => (
          <div key={i} className="flex flex-col p-1 items-center">
            <img
              src={offering.image}
              alt={offering.description}
              className="w-16 h-16 object-contain hover:scale-110"
              title={offering.killer}
              width={64}
              height={64}
            />
            <span>{offering.name}</span>
          </div>
        ))}

      {killerAddons &&
        killerAddons.map((addon, i) => (
          <div key={i} className="flex flex-row p-1 items-center">
            <img
              src={addon.image}
              alt={addon.description}
              className="w-16 h-16 object-contain hover:scale-110"
              title={addon.killer}
              width={64}
              height={64}
            />
            <span>{addon.name}</span>
          </div>
        ))}

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

      {survOffering &&
        survOffering.map((offering, i) => (
          <div key={i} className="flex flex-row p-1 items-center">
            <img
              src={offering.image}
              alt={offering.name}
              className="w-16 h-16 object-contain hover:scale-110"
              title={offering.name}
              width={64}
              height={64}
            />
            <span>{offering.name}</span>
          </div>
        ))}

      {survItem &&
        survItem.map((item, i) => (
          <div key={i} className="flex flex-row p-1 items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-contain hover:scale-110"
              title={item.name}
              width={64}
              height={64}
            />
            <span>{item.name}</span>
          </div>
        ))}

      {survivorAddons &&
        survivorAddons.map((addon, i) => (
          <div key={i} className="flex flex-row p-1 items-center">
            <img
              src={addon.image}
              alt={addon.name}
              className="w-16 h-16 object-contain hover:scale-110"
              title={addon.name}
              width={64}
              height={64}
            />
            <span>{addon.name}</span>
          </div>
        ))}

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
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src={perk.perkImage}
                alt={perk.perkName}
                className="max-w-full max-h-full object-contain hover:scale-110"
                title={perk.character ?? "Universal Perk"}
              />
            </div>

            <span>{perk.perkName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerksCard;
