(() => {
  // investment/static/performance_charts.jsx
  function Perf() {
    const [info, setInfo] = React.useState({
      "profit": "",
      "profit_per": "",
      "ai_suggestion": "",
      "symbol": "",
      "c_price": ""
    });
    React.useEffect(() => {
      const symbol2 = document.querySelector("#symbol").textContent;
      function getCookie(name) {
        const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(name + "=")).split("=")[1];
        return value;
      }
      console.log(symbol2);
      fetch(`/stock/x/api/cache/stock/${symbol2}/price`).then((Response) => {
        if (Response.status === 202) {
          fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol2}&apikey=0CDSINTOZCN895CF`).then((response) => response.json()).then((track) => {
            data = track["Global Quote"];
            console.log(data);
            fetch("/stock/x/api/cashe/save/price", {
              method: "POST",
              headers: {
                "X-CSRFToken": getCookie("csrftoken")
              },
              body: JSON.stringify({
                cashe: data
              })
            }).catch((error) => console.log(error));
            fetch("/stock/api/performance", {
              method: "POST",
              headers: {
                "X-CSRFToken": getCookie("csrftoken")
              },
              body: JSON.stringify({
                "stock_info": data
              })
            }).then((Response2) => Response2.json()).then((performance) => {
              console.log(performance);
              setInfo((prevInfo) => ({
                ...prevInfo,
                "profit": performance.total_profit,
                "profit_per": performance.profit_per,
                "symbol": symbol2,
                "c_price": track["Global Quote"]["05. price"]
              }));
              fetch(`/stock/api/predict/${symbol2}`).then((Response2) => Response2.json()).then((suggestion) => {
                setInfo((prevInfo) => ({
                  ...prevInfo,
                  "ai_suggestion": suggestion.prediction
                }));
              });
            }).catch((error) => console.error(error));
          }).catch((error) => console.error(error));
        } else if (Response.status === 200) {
          return Response.json();
        }
      }).then((track) => {
        console.log(track);
        fetch("/stock/api/performance", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify({
            "stock_info": track["prices"]
          })
        }).then((Response) => Response.json()).then((performance) => {
          console.log(performance);
          setInfo((prevInfo) => ({
            ...prevInfo,
            "profit": performance.total_profit,
            "profit_per": performance.profit_per,
            "symbol": symbol2,
            "c_price": track["prices"]["05. price"]
          }));
          fetch(`/stock/api/predict/${symbol2}`).then((Response) => Response.json()).then((suggestion) => {
            setInfo((prevInfo) => ({
              ...prevInfo,
              "ai_suggestion": suggestion.prediction
            }));
          });
        });
      });
    }, [symbol]);
    return /* @__PURE__ */ React.createElement("div", { className: "stats" }, /* @__PURE__ */ React.createElement("div", { className: "stats_div" }, "Today ", info.symbol, " stock price is ", info.c_price, "$"), /* @__PURE__ */ React.createElement("div", { className: "stats_div" }, "Profit:", /* @__PURE__ */ React.createElement("span", { className: info.profit > 0 ? "positive" : "negative" }, info.profit)), /* @__PURE__ */ React.createElement("div", { className: "stats_div" }, "Profit percentage:", /* @__PURE__ */ React.createElement("span", { className: info.profit_per > 0 ? "positive" : "negative" }, info.profit_per)), /* @__PURE__ */ React.createElement("div", { className: "stats_div" }, /* @__PURE__ */ React.createElement("span", { className: "ai-note" }, "Please note that this content was generated using our AI suggestion service. While our AI strives for accuracy, it's important to remember that mistakes can occur.(Alpha v0.1)"), "AI Suggestion: ", info.ai_suggestion));
  }
  ReactDOM.createRoot(document.querySelector("#perf")).render(/* @__PURE__ */ React.createElement(Perf, null));
})();
