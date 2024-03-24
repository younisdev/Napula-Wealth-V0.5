
function Perf() {
    const [info, setInfo] = React.useState({
        "profit": '',
        "profit_per": '',
        "ai_suggestion": "",
        "symbol": "",
        "c_price": ""
    });

    React.useEffect(() => {
        const symbol = document.querySelector("#symbol").textContent;

        function getCookie(name){
            const value = document.cookie
            .split("; ")
            .find(cookie=>cookie.startsWith(name + '='))
            .split('=')[1];

            return value;
        }
        console.log(symbol)
    fetch(`/stock/x/api/cache/stock/${symbol}/price`)
    .then(Response=>{
      if(Response.status === 202){
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=0CDSINTOZCN895CF`)
            .then(response => response.json())
            .then(track => {
                data = track['Global Quote']
                console.log(data)

                fetch('/stock/x/api/cashe/save/price', {
                    method: 'POST',
                    headers: {
                        "X-CSRFToken": getCookie('csrftoken')
                    },body: JSON.stringify({
                        cashe: data
                    })
                }).catch(error=>console.log(error))


                fetch('/stock/api/performance',{
                    method:'POST',
                    headers:{
                    "X-CSRFToken":getCookie('csrftoken')
                },body:JSON.stringify({
                    "stock_info": data

                })
                }).then(Response=>Response.json())
                .then(performance=>{
                    console.log(performance)
                    setInfo(prevInfo=>({
                        ...prevInfo,
                        "profit": performance.total_profit,
                        "profit_per": performance.profit_per,
                        "symbol": symbol,
                        "c_price": track['Global Quote']['05. price']
                    }))

                    fetch(`/stock/api/predict/${symbol}`)
                    .then(Response=>Response.json())
                    .then(suggestion=>{
                        setInfo(prevInfo=>({
                            ...prevInfo,
                            "ai_suggestion":suggestion.prediction
                        }))
                    })

                }).catch(error=>console.error(error))
            })
            .catch(error => console.error(error));
        }
        else if (Response.status === 200){
        return Response.json()}
    })
        .then(track => {
            console.log(track)
            fetch('/stock/api/performance',{
                method:'POST',
                headers:{
                "X-CSRFToken":getCookie('csrftoken')
            },body:JSON.stringify({
                "stock_info":track['prices']

            })
            }).then(Response=>Response.json())
            .then(performance=>{
                console.log(performance)
                setInfo(prevInfo=>({
                    ...prevInfo,
                    "profit": performance.total_profit,
                    "profit_per": performance.profit_per,
                    "symbol": symbol,
                    "c_price": track['prices']['05. price']
                }))

                fetch(`/stock/api/predict/${symbol}`)
                .then(Response=>Response.json())
                .then(suggestion=>{
                    setInfo(prevInfo=>({
                        ...prevInfo,
                        "ai_suggestion":suggestion.prediction
                    }))
                })

            })
        })


    }, [symbol]);


    return (
        <div className="stats">
            <div className="stats_div">Today { info.symbol } stock price is { info.c_price }$</div>
            <div className="stats_div">Profit:<span className={ info.profit > 0 ? 'positive':'negative'}>{info.profit}</span></div>
            <div className="stats_div">Profit percentage:<span className={ info.profit_per > 0 ? 'positive':'negative'}>{info.profit_per}</span></div>
            <div className="stats_div"><span className="ai-note">Please note that this content was generated using our AI suggestion service. While our AI strives for accuracy, it's important to remember that mistakes can occur.(Alpha v0.1)</span>
            AI Suggestion: {info.ai_suggestion}
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.querySelector("#perf")).render(<Perf />);
