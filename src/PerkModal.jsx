// import React from "react";
// import ReactDOM from "react-dom";
// import darkMode from "./themeSwitch";

// function PerkModal({ isOpen, onClose, children }) {
//   if (!isOpen) return null;

//   return ReactDOM.createPortal(
//     <div
//       className={`${darkMode ? "bg-black" : "bg-white"} p-70 } fixed inset-0 flex items-center justify-center z-50`}
//       onClick={onClose}
//     >
//       <div className={`${darkMode ? "bg-black" : "bg-white"} p-20 `} onClick={(e) => e.stopPropagation()}>
//         {children}
//         <button className={`${darkMode ? "bg-black" : "bg-white"}  `} onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </div>,
//     document.getElementById("modal-root")
//   );
// }

// export default PerkModal;
