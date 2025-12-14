// import { useState } from "react";
// import Modal from "./PerkModal.jsx";

function PerksCard({ perks, killer, survivor }) {
  // const [modalIsOpen, setIsOpen] = useState(false);
  // const [selectedPerk, setSelectedPerk] = useState(null);

  // const openModal = (perk) => {
  //   setSelectedPerk(perk);
  //   setIsOpen(true);
  // };

  // const closeModal = () => {
  //   setIsOpen(false);
  //   setSelectedPerk(null);
  // };

  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 justify-center">
        {killer && killer[0]?.characterImage && (
          <div id="killer-name">
            {killer[0]?.character}
            <img
              src={"https://deadbydaylight.wiki.gg" + killer[0]?.characterImage}
              alt={killer[0]?.character}
              className="w-50 flex flex-row justify-end"
            />
          </div>
        )}

        {survivor && survivor[0]?.characterImage && (
          <div id="survivor-name">
            {survivor[0]?.character}
            <img
              src={"https://deadbydaylight.wiki.gg" + survivor[0]?.characterImage}
              alt={survivor[0]?.character}
              className="w-50 flex flex-row justify-end"
            />
          </div>
        )}

        {perks.map((perk, index) => (
          <div key={index} className="flex flex-col items-center">
            {perk.character && <p id="character-name">{perk.character}</p>}

            <div>
              <img
                src={perk.perkImage}
                alt={perk.perkName}
                className=" w-20 h-20 hover:scale-110"
                // onClick={() => openModal(perk)}
              />
              <span className="text-center">{perk.perkName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* <Modal isOpen={modalIsOpen} onClose={closeModal}>
        {selectedPerk && (
          <>
            <p>{selectedPerk.character}</p>
            <img
              src={"https://deadbydaylight.wiki.gg" + selectedPerk.characterImage}
              alt=""
              className="w-20 h-20 mb-4"
            />
            <h2>{selectedPerk.perkName}</h2>
            <img src={selectedPerk.perkImage} alt="" className="w-20 h-20 mb-4" />
            <p>{selectedPerk.description}</p>
          </>
        )}
      </Modal> */}
    </>
  );
}

export default PerksCard;
