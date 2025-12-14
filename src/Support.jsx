import BMCLogoDark from "../static/bmc-dark.png";
import BMCLogoLight from "../static/bmc-light.png";

function Support({ darkMode }) {
  return <img src={darkMode ? BMCLogoDark : BMCLogoLight} alt="BMC Logo" className="w-auto h-10 align-right" />;
}

export default Support;
