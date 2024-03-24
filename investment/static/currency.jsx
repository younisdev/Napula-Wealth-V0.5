import { Msg } from "./toast";
let submit, Setsubmit, loading, SetLoading, toast, Set_toast

function Currency(){

    const[currencys, Set_currencys] = React.useState([]);

    const[input, Set_input] = React.useState(1);

    [loading, SetLoading] = React.useState(false);

    [toast, Set_toast] = React.useState({
        "message": '',
        "display": false
    })


    React.useEffect(()=>{

        fetch('/currency/api/get')
        .then(Response=>Response.json())
        .then(currency=>{
            Set_currencys(currency.Currencys || [] )
        }).catch(error=>console.error(error))

    },[])

    function Convert(){

        Set_toast({
            "display": false,
            "message": ''
        })

        from_input = document.querySelector("#from_input").value;

        const from = document.querySelector("#c-from").value;

        const to = document.querySelector("#c-to").value;


        if(from_input.trim() === '' || from.trim() === '' || to.trim() === ''){

            //todo
            Set_toast({'message': "Please fill the inputs",
            'display':true
        })


        }else{

        Setsubmit(true)
        }

    }
    function Handel_input(){

        from_input = document.querySelector("#from_input").value;

        Set_input(from_input);


    }



    return(
    <div className="currency_div">
        {toast.display?(<Msg message={toast.message}/>):null}
        <div className="container">
        <select id="c-from" className="form-select custom-selecter currency" style={{marginRight:'10px'}}>
            <option selected disabled value={''}>Select a convertion currency</option>
            { currencys.map((symbol, index)=>(
            <option key={index} value={symbol.symbol}>{symbol.symbol}</option>
            ))}
        </select>
        <span style={{ color: "black" , fontSize:"xx-large", fontWeight:"bolder"}}>&#x2192;</span>
        <select id="c-to" className="form-select custom-selecter currency" style={{marginLeft:'10px'}}>
            <option selected disabled value={''}>Select a result currency</option>
            { currencys.map((symbol, index)=>(

            <option key={index} value={symbol.symbol}>{symbol.symbol}</option>
            ))}
        </select>
        </div>
        <div className="container currency_ammount">
        <input id='from_input' type="number" className="form-control custom_input" defaultValue={1.0} min={1} style={{marginRight:'5px'}} onChange={Handel_input}></input>
        <span style={{ color: "black" , fontSize:"xx-large", fontWeight:"bolder"}}>&#x2192;</span>
        <input id='to_input' type="number" className="form-control custom_input" value={input} min={1} style={{marginLeft:'10px'}} disabled></input>
        </div>
        <button className="btn btn-dark convert_btn"  onClick={Convert}>
        { loading ?(<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>):null}
            Convert</button>
    </div>
    )


}

ReactDOM.createRoot(document.querySelector('#currency_div')).render(<Currency/>)


function Get_currency(){

    [submit, Setsubmit] = React.useState(false);


    const [result, Set_result] = React.useState({
        "ammount": 1,
        "from": 'USD',
        "conversion_price": 1,
        "to":'USD',


    });


    function getCookie(name) {
        const value = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith(name + "="))
          .split("=")[1];

        return value;
      }


    React.useEffect(()=>{

        if(submit){

            Set_toast({
                "display": false,
                "message": ""
            })

        SetLoading(true)

        const from = document.querySelector("#c-from").value;

        const to = document.querySelector("#c-to").value;

        const ammount = document.querySelector("#from_input").value

        fetch("/currency/x/api/cache")
        .then(Response=>{
            if(Response.status === 202){
                SetLoading(true)
                fetch("https://v6.exchangerate-api.com/v6/14decc2c7a414c88a56c85ec/latest/USD")
                .then(Response=>Response.json())
                .then(prices=>{

                    const price = prices.conversion_rates;

                    const from_price = price[from]

                    const to_price = price[to]

                    const conversion_price = ammount * (to_price / from_price)

                    Set_result({
                        "ammount": ammount,
                        "from": from,
                        "conversion_price": conversion_price,
                        "to": to

                    })

                    SetLoading(false)

                    Setsubmit(false)

                    fetch("/currency/x/api/get", {
                        method:"POST",
                        headers:{
                            "X-CSRFToken":getCookie('csrftoken')
                        },
                        body: JSON.stringify({
                            "prices":price
                        })
                    }).catch(error=>console.log(error))
                })


            }
            return Response.json()
        }).then(data=>{

            const cached_price = data.prices

            const from_price = cached_price[from]

            const to_price = cached_price[to]

            const conversion_price = ammount * (to_price / from_price)

            Set_result({
                "ammount": ammount,
                "from": from,
                "conversion_price": conversion_price,
                "to": to

            })

            Set_toast({
                "display": true,
                "message": "Convertion Completed"
            })

            SetLoading(false)

            Setsubmit(false)




        }).catch(error=>{
            SetLoading(false)
            console.log(error)})
    }
    },[submit])



return(
    <div className="result">
    <span className="r-convert">{result.ammount} {result.from}</span><span style={{fontSize:"x-large", fontWeight:'bolder'}}>=</span><span className="r-convert" style={{marginLeft:'5px'}}>{result.conversion_price} {result.to}</span>
    </div>
)

}


ReactDOM.createRoot(document.querySelector('#convertion-result')).render(<Get_currency/>)