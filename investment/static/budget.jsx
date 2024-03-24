import { Msg } from "./toast";

let Update, Setupdate, data, Setdata, button, Setbutton;

function Budget() {
  [button, Setbutton] = React.useState({
    income: false,
    exp: false,
    goal: false,
    goal_btn: true,
    goal_acc: false,
  });

  const [toast, Set_toast] = React.useState({
    message: "",
    display: false,
  });

  const [item, Setitem] = React.useState([]);

  const [income, Setincome] = React.useState([]);

  React.useEffect(() => {
    fetch("/budget/api/get/expenses/catagories")
      .then((Response) => Response.json())
      .then((items) => {
        Setitem(items.catagories || []);
      });

    fetch("/budget/api/get/income/catagories")
      .then((Response) => Response.json())
      .then((source) => {
        Setincome(source.Sources_Catagories || []);
      });
  }, []);

  function Handel_income_button() {
    button.income
      ? Setbutton({
          ...button,
          income: false,
        })
      : Setbutton({
          ...button,
          goal: false,
          exp: false,
          income: true,
          goal_acc: false,
        });
  }

  function Handel_exp_button() {
    button.exp
      ? Setbutton({
          ...button,
          exp: false,
        })
      : Setbutton({
          ...button,
          goal: false,
          income: false,
          exp: true,
          goal_acc: false,
        });
  }

  function Handel_Goals() {
    button.goal
      ? Setbutton({
          ...button,
          goal: false,
        })
      : Setbutton({
          goal_btn: true,
          exp: false,
          income: false,
          goal: true,
          goal_acc: false,
        });
  }

  function Handel_reset() {
    Set_toast({
      message: "",
      display: false,
    });

    fetch("/budget/api/reset", {
      method: "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }).then((Response) => {
      if (Response.ok) {
        Setupdate(true);
        Set_toast({
          message: "Reseted your budget trackers",
          display: true,
        });
      }
    });
    Setbutton({
      ...button,
      goal_acc: false,
      goal_btn: true,
    });
  }
  function Handel_rejection() {
    Setbutton({
      ...button,
      goal_acc: false,
    });
  }
  function Handel_reset_modal() {
    button.goal_acc
      ? Setbutton({
          ...button,
          goal_acc: false,
        })
      : Setbutton({
          ...button,
          exp: false,
          income: false,
          goal_acc: true,
          goal: false
        });
  }

  function getCookie(name) {
    const value = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(name + "="))
      .split("=")[1];

    return value;
  }

  function Submit_exp() {
    Set_toast({
      message: "",
      display: false,
    });
    const items = document.querySelector("#exp_item").value;

    const catagorie = document.querySelector("#exp_selection").value;

    const price = document.querySelector("#exp_price").value;

    if (items.trim() === "" || catagorie.trim() === "" || price.trim() === "") {
      //todo validation
      Set_toast({
        message: "Please fill the inputs!",
        display: true,
      });
      return;
    }

    fetch("/budget/api/add/expenses", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        item: items,
        catagories: catagorie,
        price: price,
      }),
    }).then((Response) => {
      Setupdate(true);
      document.querySelector("#exp_item").value = "";

      document.querySelector("#exp_selection").selectedIndex = 0;

      document.querySelector("#exp_price").value = "";

      Set_toast({
        message: "Added your Expense",
        display: true,
      });
    });
  }

  function Submit_income() {
    Set_toast({
      message: "",
      display: false,
    });

    const revenue_name = document.querySelector("#income-name").value;

    const revenue_catagory = document.querySelector("#income_selection").value;

    const revenue_achieved = document.querySelector("#revenue").value;

    if (
      revenue_name.trim() === "" ||
      revenue_catagory.trim() === "" ||
      revenue_achieved.trim() === ""
    ) {
      Set_toast({
        message: "Please fill the inputs!",
        display: true,
      });
      return;
    }
    fetch("/budget/api/add/income", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        revenue_name: revenue_name,
        revenue_catagory: revenue_catagory,
        revenue_achieved: revenue_achieved,
      }),
    }).then((Response) => {
      Setupdate(true);
      Set_toast({
        message: "Added your income source.",
        display: true,
      });

      document.querySelector("#income-name").value = "";

      document.querySelector("#income_selection").selectedIndex = 0;

      document.querySelector("#revenue").value = "";
    });
  }

  function Add_goals() {
    Set_toast({
      message: "",
      display: false,
    });
    budget_goal = document.querySelector("#goal").value;

    if (budget_goal.trim() === "") {
      Set_toast({
        message: "Please fill the inputs!",
        display: true,
      });
      return;
    }
    fetch("/budget/api/add/goals", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        budget_goal: budget_goal,
      }),
    }).then((Response) => {
      if (!Response.ok) {
        return;
      }
      Setupdate(true);
      Set_toast({
        message: "Added your Budget goal!",
        display: true,
      });
      Setbutton({
        ...button,
        goal: false,
        goal_btn: false,
      });
    });
  }

  return (
    <div>
      <h4>Track Your Monthly Budget:</h4>

      {toast.display ? <Msg message={toast.message} /> : null}
      <div className="row">
        <button
          className="btn btn-dark col-sm-1 col-md-3 col-lg-auto"
          onClick={Handel_income_button}
          style={{ margin: "5px", marginRight: "0", width: "189px" }}
        >
          Add an Income Source
        </button>
        <button
          className="btn btn-dark col-sm-1 col-md-3 col-lg-auto"
          onClick={Handel_exp_button}
          style={{ margin: "5px", marginRight: "0", width: "189px" }}
        >
          Add expensives
        </button>
        {button.goal_btn ? (
          <button
            className="btn btn-dark col-sm-1 col-md-2 col-lg-auto"
            onClick={Handel_Goals}
            style={{ margin: "5px", marginRight: "0", width: "189px" }}
          >
            Add Monthly Goal
          </button>
        ) : null}
        <button
          className="btn btn-dark col-sm-1 col-md-3 col-lg-auto"
          onClick={Handel_reset_modal}
          style={{ margin: "5px", marginRight: "0", width: "189px" }}
        >
          Rest Budget
        </button>
      </div>
      {button.goal_acc ? (
        <div className="exp_div">
          <h4 style={{ marginLeft: "80px" }}>
            Are you sure you want to reset your budget?
          </h4>
          <button
            className="btn btn-dark"
            style={{ marginLeft: "230px" }}
            onClick={Handel_reset}
          >
            Yes
          </button>
          <button
            className="btn btn-dark"
            style={{ marginLeft: "20px" }}
            onClick={Handel_rejection}
          >
            No
          </button>
        </div>
      ) : null}
      {button.exp ? (
        <div className="exp_div">
          <h4 style={{ marginLeft: "90px" }}>Add Expenses item</h4>
          <input
            type="text"
            placeholder="Item name"
            className="form-control exp_inputs"
            id="exp_item"
          ></input>
          <select id="exp_selection" className="form-select exp_inputs">
            <option value={""} disabled selected>
              Select Item Catagorie
            </option>
            {item.map((items, index) => (
              <option key={index}>{items.catagories}</option>
            ))}
          </select>
          <input
            type="number"
            className="form-contorl exp_inputs"
            min={1}
            id="exp_price"
            placeholder="Money Spent in $"
          ></input>
          <button
            className="btn btn-dark"
            style={{ marginLeft: "140px" }}
            onClick={Submit_exp}
          >
            Add Expensive item
          </button>
        </div>
      ) : null}
      {button.income ? (
        <div className="exp_div">
          <h4 style={{ marginLeft: "90px" }}>Add Revenue Source</h4>
          <input
            type="text"
            className="form-control exp_inputs"
            id="income-name"
            placeholder="Revenue name"
          ></input>
          <select id="income_selection" className="form-select exp_inputs">
            <option value={""} selected disabled>
              Select income Catagorie
            </option>
            {income.map((income, index) => (
              <option key={index}>{income.catagories}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            id="revenue"
            placeholder="Revenue achieved"
            className="form-contorl exp_inputs"
          ></input>
          <button
            className="btn btn-dark"
            style={{ marginLeft: "140px" }}
            onClick={Submit_income}
          >
            Add Income Source
          </button>
        </div>
      ) : null}
      {button.goal ? (
        <div className="exp_div">
          <h4 style={{ marginLeft: "90px" }} min={1}>
            Add Monthly Goal
          </h4>
          <input
            type="number"
            placeholder="Add Budget goal"
            className="form-contorl exp_inputs"
            id="goal"
          ></input>
          <button
            className="btn btn-dark"
            style={{ marginLeft: "160px" }}
            onClick={Add_goals}
          >
            Add Goal
          </button>
        </div>
      ) : null}

      <hr></hr>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#Budget_div")).render(<Budget />);

function Budget_visualizing() {
  [Update, Setupdate] = React.useState(false);

  [data, Setdata] = React.useState({
    Expenses: [],
    Income: [],
    budget: 0,
    goal: "Not Assigned",
  });

  React.useEffect(() => {
    fetch("/budget/api/get/expenses")
      .then((Response) => {
        if (!Response.ok) {
        } else {
          return Response.json();
        }
      })
      .then((expense) => {
        Setupdate(false);
        Setdata((prevState) => ({
          ...prevState,
          Expenses: expense.Expenses || [],
        }));
      });

    fetch("/budget/api/get/income")
      .then((Response) => {
        if (!Response.ok) {
        } else {
          return Response.json();
        }
      })
      .then((income) => {
        Setupdate(false);
        Setdata((prevState) => ({
          ...prevState,
          Income: income.Sources || [],
        }));
      });

    fetch("/budget/api/status")
      .then((Response) => Response.json())
      .then((budget) => {
        Setdata((prevState) => ({
          ...prevState,
          budget: budget.budget,
        }));
      });

    fetch("/budget/api/get/goals")
      .then((Response) => {
        if (Response.status === 202) {
          Setdata((prevState) => ({
            ...prevState,
            goal: "Not Assigned",
          }));
        } else {
          Setbutton({
            ...button,
            goal_btn: false,
          });
        }
        return Response.json();
      })
      .then((goal) => {
        monthly_goal = goal["Monthly Goal"];

        console.log(monthly_goal);

        if (
          (monthly_goal &&
            monthly_goal.budget !== null &&
            !isNaN(monthly_goal.budget)) ||
          monthly_goal === 0
        ) {
          Setdata((prevState) => ({
            ...prevState,
            goal: `${goal["Monthly Goal"].budget}$`,
          }));
        }
      });
  }, [Update]);

  return (
    <div>
      <div className={`stats_div ${data.budget > 0 ? "positive" : "negative"}`}>
        Budget:{data.budget}$
      </div>
      <div className="stats_div positive">Goal:{data.goal}</div>

      <hr></hr>
      <table className="table table-dark table-hover custom-table first-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Expenses Catagorie</th>
            <th>price</th>
            <th>at</th>
          </tr>
        </thead>
        <tbody>
          {data.Expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.item}</td>
              <td>{expense.Catagories}</td>
              <td>{expense.price}</td>
              <td>{expense.tracked_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table table-dark table-hover custom-table">
        <thead>
          <tr>
            <th>Income Source</th>
            <th>Source Catagorie</th>
            <th>Revenue</th>
            <th>at</th>
          </tr>
        </thead>
        <tbody>
          {data.Income.map((income, index) => (
            <tr key={index}>
              <td>{income.source}</td>
              <td>{income.categories}</td>
              <td>{income.revenue}</td>
              <td>{income.tracked_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector("#Budget_table")).render(
  <Budget_visualizing />,
);
