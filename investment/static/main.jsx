import { Msg } from "./toast";

let Update, Setupdate, toast, Set_toast;

function Main() {
  const [selection, Setselect] = React.useState([]);

  [toast, Set_toast] = React.useState({
    "message": '',
    "display": false
});


  React.useEffect(() => {
    fetch("/api/get_symbols")
      .then((Response) => Response.json())
      .then((data) => {
        Setselect(data.Stock || []);
      })
      .catch((error) => console.error("Failed to get data from api", error));
  }, []);

  function Add_stock() {
    Set_toast({
      'display': false,
      'message': ''

    })

    const select = document.querySelector("#stock_selection").value;

    const ammount = document.querySelector(".amount").value;


    if (select.trim() == '' || ammount.trim() == '') {
      Set_toast({
        'display': true,
        'message': `Please fill the inputs`

      })
      return
    }




    function getCookie(name) {
      const value = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(name + "="))
        .split("=")[1];

      return value;
    }

    //Track and cache stock prices
    fetch(`stock/x/api/cache/stock/${select}/price`)
      .then((Response) => {
        if (Response.status === 202) {
          fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${select}&apikey=0CDSINTOZCN895CF`,
          )
            .then((Response) => {
              if (Response.ok) {
                return Response.json();
              }
            })
            .then((data) => {
              const price = data["Global Quote"]["05. price"];

              fetch("/stock/api/save/symbol", {
                method: "POST",
                headers: {
                  "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify({
                  symbol: select,
                  ammount: ammount,
                  price: price,
                }),
              })
                .then((Response) => {
                  if (Response.ok) {
                    document.querySelector("#stock_selection").value = 'Select Stocks to track';

                    document.querySelector(".amount").value = "";

                    Setupdate((prevState) => !prevState);

                    Set_toast({
                      'display': true,
                      'message': `Tracked ${select} symbol!`

                    })

                    fetch("stock/x/api/cashe/save/price", {
                      method: "POST",
                      headers: {
                        "X-CSRFToken": getCookie("csrftoken"),
                      },
                      body: JSON.stringify({
                        cashe: data["Global Quote"],
                      }),
                    });
                  }
                })
                .catch((error) =>
                  console.log("Failed to get data from api", error),
                );
            })
            .catch((error) =>
              console.log("Failed to get data from api", error),
            );
        }
        return Response.json();
      })
      .then((cache) => {
        price = cache.prices['05. price'];

        fetch("/stock/api/save/symbol", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCookie("csrftoken"),
          },
          body: JSON.stringify({
            symbol: select,
            ammount: ammount,
            price: price,
          }),
        })
          .then((Response) => {
            if (Response.ok) {
              document.querySelector("#stock_selection").value = 'Select Stocks to track';

              document.querySelector(".amount").value = "";

              Set_toast({
                'display': true,
                'message': `Tracked ${select} symbol!`

              })

              Setupdate((prevState) => !prevState);
            }
          })
          .catch((error) => console.log("Failed to get data from api", error));
      })
      .catch((error) => console.log("Failed to get data from api", error));
  }
  return (
    <div>
      { toast.display? (<Msg message={toast.message}/>):null}
      <select id="stock_selection" className="form-select custom-selecter">
        <option selected disabled>
          Select Stocks to track
        </option>
        {selection.map((stock, index) => (
          <option key={index} value={stock.symbol}>
            {stock.symbol}
          </option>
        ))}
      </select>
      <input className="form-control amount" placeholder="ammount"type="number"min={1}></input>

      <button className="btn btn-dark custom_btn" onClick={Add_stock}>
        Track stocks
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#select_stocks")).render(<Main />);

function App() {
  [Update, Setupdate] = React.useState(false);

  function getCookie(name){
    const value = document.cookie
    .split("; ")
    .find(cookie=>cookie.startsWith(name + '='))
    .split('=')[1];

    return value;
}

  const [track, Settrack] = React.useState([]);
  React.useEffect(() => {
    fetch("/stock/api/symbols")
      .then((Response) => Response.json())
      .then((data) => {
        Settrack(data.tracked_stocks);
      })
      .catch((error) => console.error(error));
  }, [Update]);

  function Handel_remove(event) {
    Set_toast({
      message: "",
      display: false,
    });


    const track_div = event.target.closest('.track_stock')

    const get_symbol = track_div.querySelector('#symbol_span').textContent.split('Symbol:')[1];

    const date = track_div.querySelector('#at_span').textContent.split('Bought at:')[1]

    fetch("/stock/api/remove/symbol", {
      method: 'DELETE',
      headers: {
        "X-CSRFToken": getCookie('csrftoken')
      },body:JSON.stringify({
        "symbol": get_symbol,
        'date': date
      })
    }).then(Response=>{
      if (Response.ok) {
        Set_toast({
          'display': true,
          'message': `Untracked ${get_symbol.trim()} symbol`

        })
        Setupdate((prevState) => !prevState);
      }
    })




  }

  return (
    <div className="row">
      {track.map((track, index) => (
        <div className="track_stock col-sm-1 col-md-3 col-lg-5">
        <button type="button" class="btn-close" aria-label="Close" style={{margin:"5px 0 0 260px"}} onClick={Handel_remove}></button>
          <a key={index} href={`/stock/${track.symbol_info.symbol}`}>
            <span id='symbol_span'>Symbol: {track.symbol_info.symbol}</span>
            <span id='price_span'>Original bougth price:{track.price}</span>
            <span id='Net_span'>Original Net bougth price:{track.net_price}</span>
            <span id='at_span'>Bought at: {track.tracked_at}</span>
          </a>
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#stock")).render(<App />);
