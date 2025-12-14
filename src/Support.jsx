import BMCLogoDark from "../static/bmc-dark.png";
import BMCLogoLight from "../static/bmc-light.png";

function Support({ darkMode }) {
  return (
    <>
      <a href="https://buymeacoffee.com/ult1mat3s" target="_blank" rel="noopener noreferrer">
        <img src={darkMode ? BMCLogoDark : BMCLogoLight} alt="BMC Logo" className="w-auto h-10 align-right" />;
      </a>
    </>
  );
}

export default Support;
