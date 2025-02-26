import { useState, useRef, useEffect } from "react";
import { useWS } from "./useWS";

export const App = () => {

  const { sendMessage } = useWS({
    onMessage: (message) => {
      const data = JSON.parse(message);

      if (data.type === "change-page") {
        console.log("received: change-page", data.pageNumber);
        setPageNumber(data.pageNumber);
      }
    },
  });

  useEffect(() => {
    sendMessage({
      type: "browser-data",
      payload: {
        browser: 'test',
        version: '1.0.0',
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        online: navigator.onLine,

      }
    });
  }, []);

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
          ref={ref}
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
          </div>
        </div>
      </div>
    </div>
  );
};
