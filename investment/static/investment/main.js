(() => {
  // investment/static/toast.jsx
  var Msg = ({ message }) => {
    const [show, Setshow] = React.useState(false);
    const Handel_show = () => {
      Setshow(true);
    };
    React.useEffect(() => {
      Handel_show();
    }, [message]);
    const handel_close = () => {
      Setshow(false);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "toast_container" }, /* @__PURE__ */ React.createElement(ReactBootstrap.Toast, { onClose: handel_close, show, delay: 1e4, autohide: true, set: true, bg: "primary" }, /* @__PURE__ */ React.createElement(ReactBootstrap.Toast.Header, null, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "/static/investment/NW.png",
        className: "rounded me-2",
        style: { width: "20px", height: "20px" },
        alt: ""
      }
    ), /* @__PURE__ */ React.createElement("strong", { className: "me-auto" }, "Napual Wealth")), /* @__PURE__ */ React.createElement(ReactBootstrap.Toast.Body, null, message)));
  };

  // investment/static/main.jsx
  var Update;
  var Setupdate;
  var toast;
  var Set_toast;
  function Main() {
    const [selection, Setselect] = React.useState([]);
    [toast, Set_toast] = React.useState({
      "message": "",
      "display": false
    });
    React.useEffect(() => {
      fetch("/api/get_symbols").then((Response) => Response.json()).then((data) => {
        Setselect(data.Stock || []);
      }).catch((error) => console.error("Failed to get data from api", error));
    }, []);
    function Add_stock() {
      Set_toast({
        "display": false,
        "message": ""
      });
      const select = document.querySelector("#stock_selection").value;
      const ammount = document.querySelector(".amount").value;
      if (select.trim() == "" || ammount.trim() == "") {
        Set_toast({
          "display": true,
          "message": `Please fill the inputs`
        });
        return;
      }
      function getCookie(name) {
        const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(name + "=")).split("=")[1];
        return value;
      }
      fetch(`stock/x/api/cache/stock/${select}/price`).then((Response) => {
        if (Response.status === 202) {
          fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${select}&apikey=0CDSINTOZCN895CF`
          ).then((Response2) => {
            if (Response2.ok) {
              return Response2.json();
            }
          }).then((data) => {
            const price2 = data["Global Quote"]["05. price"];
            fetch("/stock/api/save/symbol", {
              method: "POST",
              headers: {
                "X-CSRFToken": getCookie("csrftoken")
              },
              body: JSON.stringify({
                symbol: select,
                ammount,
                price: price2
              })
            }).then((Response2) => {
              if (Response2.ok) {
                document.querySelector("#stock_selection").value = "Select Stocks to track";
                document.querySelector(".amount").value = "";
                Setupdate((prevState) => !prevState);
                Set_toast({
                  "display": true,
                  "message": `Tracked ${select} symbol!`
                });
                fetch("stock/x/api/cashe/save/price", {
                  method: "POST",
                  headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                  },
                  body: JSON.stringify({
                    cashe: data["Global Quote"]
                  })
                });
              }
            }).catch(
              (error) => console.log("Failed to get data from api", error)
            );
          }).catch(
            (error) => console.log("Failed to get data from api", error)
          );
        }
        return Response.json();
      }).then((cache) => {
        price = cache.prices["05. price"];
        fetch("/stock/api/save/symbol", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify({
            symbol: select,
            ammount,
            price
          })
        }).then((Response) => {
          if (Response.ok) {
            document.querySelector("#stock_selection").value = "Select Stocks to track";
            document.querySelector(".amount").value = "";
            Set_toast({
              "display": true,
              "message": `Tracked ${select} symbol!`
            });
            Setupdate((prevState) => !prevState);
          }
        }).catch((error) => console.log("Failed to get data from api", error));
      }).catch((error) => console.log("Failed to get data from api", error));
    }
    return /* @__PURE__ */ React.createElement("div", null, toast.display ? /* @__PURE__ */ React.createElement(Msg, { message: toast.message }) : null, /* @__PURE__ */ React.createElement("select", { id: "stock_selection", className: "form-select custom-selecter" }, /* @__PURE__ */ React.createElement("option", { selected: true, disabled: true }, "Select Stocks to track"), selection.map((stock, index) => /* @__PURE__ */ React.createElement("option", { key: index, value: stock.symbol }, stock.symbol))), /* @__PURE__ */ React.createElement("input", { className: "form-control amount", placeholder: "ammount", type: "number", min: 1 }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-dark custom_btn", onClick: Add_stock }, "Track stocks"));
  }
  ReactDOM.createRoot(document.querySelector("#select_stocks")).render(/* @__PURE__ */ React.createElement(Main, null));
  function App() {
    [Update, Setupdate] = React.useState(false);
    function getCookie(name) {
      const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(name + "=")).split("=")[1];
      return value;
    }
    const [track, Settrack] = React.useState([]);
    React.useEffect(() => {
      fetch("/stock/api/symbols").then((Response) => Response.json()).then((data) => {
        Settrack(data.tracked_stocks);
      }).catch((error) => console.error(error));
    }, [Update]);
    function Handel_remove(event) {
      Set_toast({
        message: "",
        display: false
      });
      const track_div = event.target.closest(".track_stock");
      const get_symbol = track_div.querySelector("#symbol_span").textContent.split("Symbol:")[1];
      const date = track_div.querySelector("#at_span").textContent.split("Bought at:")[1];
      fetch("/stock/api/remove/symbol", {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          "symbol": get_symbol,
          "date": date
        })
      }).then((Response) => {
        if (Response.ok) {
          Set_toast({
            "display": true,
            "message": `Untracked ${get_symbol.trim()} symbol`
          });
          Setupdate((prevState) => !prevState);
        }
      });
    }
    return /* @__PURE__ */ React.createElement("div", { className: "row" }, track.map((track2, index) => /* @__PURE__ */ React.createElement("div", { className: "track_stock col-sm-1 col-md-3 col-lg-5" }, /* @__PURE__ */ React.createElement("button", { type: "button", class: "btn-close", "aria-label": "Close", style: { margin: "5px 0 0 260px" }, onClick: Handel_remove }), /* @__PURE__ */ React.createElement("a", { key: index, href: `/stock/${track2.symbol_info.symbol}` }, /* @__PURE__ */ React.createElement("span", { id: "symbol_span" }, "Symbol: ", track2.symbol_info.symbol), /* @__PURE__ */ React.createElement("span", { id: "price_span" }, "Original bougth price:", track2.price), /* @__PURE__ */ React.createElement("span", { id: "Net_span" }, "Original Net bougth price:", track2.net_price), /* @__PURE__ */ React.createElement("span", { id: "at_span" }, "Bought at: ", track2.tracked_at)))));
  }
  ReactDOM.createRoot(document.querySelector("#stock")).render(/* @__PURE__ */ React.createElement(App, null));
})();
