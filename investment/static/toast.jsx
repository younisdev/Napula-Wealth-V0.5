

export const Msg = ({message}) =>{

    const [show, Setshow] = React.useState(false);
    const Handel_show = ()=>{Setshow(true)}

    React.useEffect(()=>{
        Handel_show();
    },[message])

    const handel_close= ()=>{Setshow(false)};


    return(
    <div className="toast_container">
    <ReactBootstrap.Toast onClose={handel_close} show={show} delay={10000} autohide set bg={'primary'}>
        <ReactBootstrap.Toast.Header>
        <img
              src="/static/investment/NW.png"
              className="rounded me-2"
              style={{width:'20px',height:'20px'}}
              alt=""
            />
            <strong className="me-auto" >Napual Wealth</strong>
        </ReactBootstrap.Toast.Header>

        <ReactBootstrap.Toast.Body>{message}</ReactBootstrap.Toast.Body>

    </ReactBootstrap.Toast>
    </div>
    )
}