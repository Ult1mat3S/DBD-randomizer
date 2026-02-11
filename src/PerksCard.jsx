import DOMPurify from "dompurify";
import { useRef, useState } from "react";

function safelyDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

function PerksCard({ perks, killer, survivor, killerAddons, killerOffering, survItem, survOffering, survivorAddons }) {
  const dialogRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null);

  function openButton(item) {
    setSelectedItem(item);
    document.body.style.overflow = "hidden";
    dialogRef.current.showModal();
  }

  function closeButton() {
    document.body.style.overflow = "";
    dialogRef.current.close();
  }

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
              onClick={() => openButton(offering)}
            />
            <span>{offering.name}</span>
          </div>
        ))}
      {killerAddons &&
        killerAddons.map((addon, i) => (
          <div key={i} className="flex flex-row p-1 items-center">
            <img
              src={addon.image}
              alt={addon.name}
              className="w-16 h-16 object-contain hover:scale-110"
              title={addon.killer}
              width={64}
              height={64}
              onClick={() => openButton(addon)}
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
              onClick={() => openButton(offering)}
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
              onClick={() => openButton(item)}
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
              onClick={() => openButton(addon)}
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
                title={perk.character ?? "Common Perk"}
                onClick={() => openButton(perk)}
              />
            </div>

            <span>{perk.perkName}</span>
          </div>
        ))}
      </div>

      <dialog ref={dialogRef} className="p-6 rounded-lg w-[500px] max-h-[80vh] mx-auto my-auto ">
        <button onClick={closeButton} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
          Close
        </button>

        {selectedItem && (
          <div className="flex flex-col items-center gap-4 overflow-y-auto">
            <img
              src={selectedItem.perkImage || selectedItem.image}
              alt={selectedItem.perkName || selectedItem.name}
              className="w-32 h-32 object-contain"
            />

            <h2 className="text-xl font-bold"> {selectedItem.perkName || selectedItem.name}</h2>

            {selectedItem.description && (
              <div
                className="text-center max-w-md"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(safelyDecode(selectedItem.description)),
                }}
              />
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}

export default PerksCard;
