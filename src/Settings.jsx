import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [hideOwnerNames, setHideOwnerNames] = useState(localStorage.getItem("setHideOwnerNames") === true);
  localStorage.setItem("hideOwnerNames", "true");

  function handleCheckbox(e) {
    if (e.target.checked) {
      console.log("checked");
    }

    // else {
    //   localStorage.removeItem("hideOwnerNames");
    // }
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    console.log("submit");
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center ">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <form className="flex flex-col" method="post" onSubmit={handleSubmit}>
          {/* <button type="button" onClick={() => navigate(-1)} className="max-w-24">
            Back
          </button> */}

          <div>
            <input
              type="checkbox"
              name="hideOwnerNames"
              id="hideOwnerNames"
              onChange={() => {
                handleCheckbox;
              }}
            />
            <label htmlFor="hideOwnerNames"> Hide perk owner names</label>
          </div>

          <button type="submit" className="max-w-24">
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export default Settings;
