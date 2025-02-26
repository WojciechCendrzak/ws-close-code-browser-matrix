import { useEffect, useState } from "react";
import { useWS } from "./useWS";

import Bowser from "bowser";

const userAgent = Bowser.parse(window.navigator.userAgent);

const browserInfo = {
  browserName: userAgent.browser.name,
  browserVersion: userAgent.browser.version,
  osName: userAgent.os.name,
  osVersion: userAgent.os.version,
  platform: userAgent.platform.type,
};

export const App = () => {
  const [closingTabMode, setClosingTabMode] = useState(false);
  const [allBrowserData, setAllBrowserData] = useState([]);
  const { sendMessage, loading } = useWS({
    onMessage: (message) => {
      console.log("received: ", { message });

      const { type, payload } = JSON.parse(message);

      if (type === "all-browser-data") {
        setAllBrowserData(payload);
      }
    },
  });

  useEffect(() => {
    if (loading) return;

    sendMessage(
      JSON.stringify({
        type: "browser-data",
        payload: {
          browserName: userAgent.browser.name,
          browserVersion: userAgent.browser.version,
          osName: userAgent.os.name,
          osVersion: userAgent.os.version,
          platform: userAgent.platform.type,
          closingTabMode,
        },
      })
    );

    sendMessage(
      JSON.stringify({
        type: "get-all-browser-data",
      })
    );
  }, [sendMessage, loading, closingTabMode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          border: "1px dashed red",
          margin: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed blue",
            margin: "16px",
            overflow: "hidden",
          }}
        >
          <div>
            <h1>Hello</h1>
            <button onClick={() => setClosingTabMode(!closingTabMode)}>
              {closingTabMode ? "closing" : "refreshing"}
            </button>
            <h2>This browser is:</h2>
            <SimpleTable data={[browserInfo]} />
            <h3>All browser data:</h3>
            <SimpleTable data={allBrowserData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleTable = ({ data }) => {
  return (
    <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Browser Name</th>
          <th>Browser Version</th>
          <th>OS Name</th>
          <th>OS Version</th>
          <th>Platform</th>
          <th>WS Close Code On Refresh</th>
          <th>WS Close Code On Close</th>
        </tr>
      </thead>
      <tbody>
        {data.map((info, index) => (
          <tr key={index}>
            <td>{info.browserName}</td>
            <td>{info.browserVersion}</td>
            <td>{info.osName}</td>
            <td>{info.osVersion}</td>
            <td>{info.platform}</td>
            <td>{info.closeCodeOnRefresh}</td>
            <td>{info.closeCodeOnClose}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SimpleTable;
