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

  // investment/static/currency.jsx
  var submit;
  var Setsubmit;
  var loading;
  var SetLoading;
  var toast;
  var Set_toast;
  function Currency() {
    const [currencys, Set_currencys] = React.useState([]);
    const [input, Set_input] = React.useState(1);
    [loading, SetLoading] = React.useState(false);
    [toast, Set_toast] = React.useState({
      "message": "",
      "display": false
    });
    React.useEffect(() => {
      fetch("/currency/api/get").then((Response) => Response.json()).then((currency) => {
        Set_currencys(currency.Currencys || []);
      }).catch((error) => console.error(error));
    }, []);
    function Convert() {
      Set_toast({
        "display": false,
        "message": ""
      });
      from_input = document.querySelector("#from_input").value;
      const from = document.querySelector("#c-from").value;
      const to = document.querySelector("#c-to").value;
      if (from_input.trim() === "" || from.trim() === "" || to.trim() === "") {
        Set_toast({
          "message": "Please fill the inputs",
          "display": true
        });
      } else {
        Setsubmit(true);
      }
    }
    function Handel_input() {
      from_input = document.querySelector("#from_input").value;
      Set_input(from_input);
    }
    return /* @__PURE__ */ React.createElement("div", { className: "currency_div" }, toast.display ? /* @__PURE__ */ React.createElement(Msg, { message: toast.message }) : null, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("select", { id: "c-from", className: "form-select custom-selecter currency", style: { marginRight: "10px" } }, /* @__PURE__ */ React.createElement("option", { selected: true, disabled: true, value: "" }, "Select a convertion currency"), currencys.map((symbol, index) => /* @__PURE__ */ React.createElement("option", { key: index, value: symbol.symbol }, symbol.symbol))), /* @__PURE__ */ React.createElement("span", { style: { color: "black", fontSize: "xx-large", fontWeight: "bolder" } }, "\u2192"), /* @__PURE__ */ React.createElement("select", { id: "c-to", className: "form-select custom-selecter currency", style: { marginLeft: "10px" } }, /* @__PURE__ */ React.createElement("option", { selected: true, disabled: true, value: "" }, "Select a result currency"), currencys.map((symbol, index) => /* @__PURE__ */ React.createElement("option", { key: index, value: symbol.symbol }, symbol.symbol)))), /* @__PURE__ */ React.createElement("div", { className: "container currency_ammount" }, /* @__PURE__ */ React.createElement("input", { id: "from_input", type: "number", className: "form-control custom_input", defaultValue: 1, min: 1, style: { marginRight: "5px" }, onChange: Handel_input }), /* @__PURE__ */ React.createElement("span", { style: { color: "black", fontSize: "xx-large", fontWeight: "bolder" } }, "\u2192"), /* @__PURE__ */ React.createElement("input", { id: "to_input", type: "number", className: "form-control custom_input", value: input, min: 1, style: { marginLeft: "10px" }, disabled: true })), /* @__PURE__ */ React.createElement("button", { className: "btn btn-dark convert_btn", onClick: Convert }, loading ? /* @__PURE__ */ React.createElement("span", { className: "spinner-border spinner-border-sm", role: "status", "aria-hidden": "true" }) : null, "Convert"));
  }
  ReactDOM.createRoot(document.querySelector("#currency_div")).render(/* @__PURE__ */ React.createElement(Currency, null));
  function Get_currency() {
    [submit, Setsubmit] = React.useState(false);
    const [result, Set_result] = React.useState({
      "ammount": 1,
      "from": "USD",
      "conversion_price": 1,
      "to": "USD"
    });
    function getCookie(name) {
      const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(name + "=")).split("=")[1];
      return value;
    }
    React.useEffect(() => {
      if (submit) {
        Set_toast({
          "display": false,
          "message": ""
        });
        SetLoading(true);
        const from = document.querySelector("#c-from").value;
        const to = document.querySelector("#c-to").value;
        const ammount = document.querySelector("#from_input").value;
        fetch("/currency/x/api/cache").then((Response) => {
          if (Response.status === 202) {
            SetLoading(true);
            fetch("https://v6.exchangerate-api.com/v6/14decc2c7a414c88a56c85ec/latest/USD").then((Response2) => Response2.json()).then((prices) => {
              const price = prices.conversion_rates;
              const from_price = price[from];
              const to_price = price[to];
              const conversion_price = ammount * (to_price / from_price);
              Set_result({
                "ammount": ammount,
                "from": from,
                "conversion_price": conversion_price,
                "to": to
              });
              SetLoading(false);
              Setsubmit(false);
              fetch("/currency/x/api/get", {
                method: "POST",
                headers: {
                  "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({
                  "prices": price
                })
              }).catch((error) => console.log(error));
            });
          }
          return Response.json();
        }).then((data) => {
          const cached_price = data.prices;
          const from_price = cached_price[from];
          const to_price = cached_price[to];
          const conversion_price = ammount * (to_price / from_price);
          Set_result({
            "ammount": ammount,
            "from": from,
            "conversion_price": conversion_price,
            "to": to
          });
          Set_toast({
            "display": true,
            "message": "Convertion Completed"
          });
          SetLoading(false);
          Setsubmit(false);
        }).catch((error) => {
          SetLoading(false);
          console.log(error);
        });
      }
    }, [submit]);
    return /* @__PURE__ */ React.createElement("div", { className: "result" }, /* @__PURE__ */ React.createElement("span", { className: "r-convert" }, result.ammount, " ", result.from), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "x-large", fontWeight: "bolder" } }, "="), /* @__PURE__ */ React.createElement("span", { className: "r-convert", style: { marginLeft: "5px" } }, result.conversion_price, " ", result.to));
  }
  ReactDOM.createRoot(document.querySelector("#convertion-result")).render(/* @__PURE__ */ React.createElement(Get_currency, null));
})();
