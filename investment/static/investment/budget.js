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

  // investment/static/budget.jsx
  var Update;
  var Setupdate;
  var data;
  var Setdata;
  var button;
  var Setbutton;
  function Budget() {
    [button, Setbutton] = React.useState({
      income: false,
      exp: false,
      goal: false,
      goal_btn: true,
      goal_acc: false
    });
    const [toast, Set_toast] = React.useState({
      message: "",
      display: false
    });
    const [item, Setitem] = React.useState([]);
    const [income, Setincome] = React.useState([]);
    React.useEffect(() => {
      fetch("/budget/api/get/expenses/catagories").then((Response) => Response.json()).then((items) => {
        Setitem(items.catagories || []);
      });
      fetch("/budget/api/get/income/catagories").then((Response) => Response.json()).then((source) => {
        Setincome(source.Sources_Catagories || []);
      });
    }, []);
    function Handel_income_button() {
      button.income ? Setbutton({
        ...button,
        income: false
      }) : Setbutton({
        ...button,
        goal: false,
        exp: false,
        income: true,
        goal_acc: false
      });
    }
    function Handel_exp_button() {
      button.exp ? Setbutton({
        ...button,
        exp: false
      }) : Setbutton({
        ...button,
        goal: false,
        income: false,
        exp: true,
        goal_acc: false
      });
    }
    function Handel_Goals() {
      button.goal ? Setbutton({
        ...button,
        goal: false
      }) : Setbutton({
        goal_btn: true,
        exp: false,
        income: false,
        goal: true,
        goal_acc: false
      });
    }
    function Handel_reset() {
      Set_toast({
        message: "",
        display: false
      });
      fetch("/budget/api/reset", {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        }
      }).then((Response) => {
        if (Response.ok) {
          Setupdate(true);
          Set_toast({
            message: "Reseted your budget trackers",
            display: true
          });
        }
      });
      Setbutton({
        ...button,
        goal_acc: false,
        goal_btn: true
      });
    }
    function Handel_rejection() {
      Setbutton({
        ...button,
        goal_acc: false
      });
    }
    function Handel_reset_modal() {
      button.goal_acc ? Setbutton({
        ...button,
        goal_acc: false
      }) : Setbutton({
        ...button,
        exp: false,
        income: false,
        goal_acc: true,
        goal: false
      });
    }
    function getCookie(name) {
      const value = document.cookie.split("; ").find((cookie) => cookie.startsWith(name + "=")).split("=")[1];
      return value;
    }
    function Submit_exp() {
      Set_toast({
        message: "",
        display: false
      });
      const items = document.querySelector("#exp_item").value;
      const catagorie = document.querySelector("#exp_selection").value;
      const price = document.querySelector("#exp_price").value;
      if (items.trim() === "" || catagorie.trim() === "" || price.trim() === "") {
        Set_toast({
          message: "Please fill the inputs!",
          display: true
        });
        return;
      }
      fetch("/budget/api/add/expenses", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          item: items,
          catagories: catagorie,
          price
        })
      }).then((Response) => {
        Setupdate(true);
        document.querySelector("#exp_item").value = "";
        document.querySelector("#exp_selection").selectedIndex = 0;
        document.querySelector("#exp_price").value = "";
        Set_toast({
          message: "Added your Expense",
          display: true
        });
      });
    }
    function Submit_income() {
      Set_toast({
        message: "",
        display: false
      });
      const revenue_name = document.querySelector("#income-name").value;
      const revenue_catagory = document.querySelector("#income_selection").value;
      const revenue_achieved = document.querySelector("#revenue").value;
      if (revenue_name.trim() === "" || revenue_catagory.trim() === "" || revenue_achieved.trim() === "") {
        Set_toast({
          message: "Please fill the inputs!",
          display: true
        });
        return;
      }
      fetch("/budget/api/add/income", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          revenue_name,
          revenue_catagory,
          revenue_achieved
        })
      }).then((Response) => {
        Setupdate(true);
        Set_toast({
          message: "Added your income source.",
          display: true
        });
        document.querySelector("#income-name").value = "";
        document.querySelector("#income_selection").selectedIndex = 0;
        document.querySelector("#revenue").value = "";
      });
    }
    function Add_goals() {
      Set_toast({
        message: "",
        display: false
      });
      budget_goal = document.querySelector("#goal").value;
      if (budget_goal.trim() === "") {
        Set_toast({
          message: "Please fill the inputs!",
          display: true
        });
        return;
      }
      fetch("/budget/api/add/goals", {
        method: "POST",
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
          budget_goal
        })
      }).then((Response) => {
        if (!Response.ok) {
          return;
        }
        Setupdate(true);
        Set_toast({
          message: "Added your Budget goal!",
          display: true
        });
        Setbutton({
          ...button,
          goal: false,
          goal_btn: false
        });
      });
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", null, "Track Your Monthly Budget:"), toast.display ? /* @__PURE__ */ React.createElement(Msg, { message: toast.message }) : null, /* @__PURE__ */ React.createElement("div", { className: "row" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark col-sm-1 col-md-3 col-lg-auto",
        onClick: Handel_income_button,
        style: { margin: "5px", marginRight: "0", width: "189px" }
      },
      "Add an Income Source"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark col-sm-1 col-md-3 col-lg-auto",
        onClick: Handel_exp_button,
        style: { margin: "5px", marginRight: "0", width: "189px" }
      },
      "Add expensives"
    ), button.goal_btn ? /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark col-sm-1 col-md-2 col-lg-auto",
        onClick: Handel_Goals,
        style: { margin: "5px", marginRight: "0", width: "189px" }
      },
      "Add Monthly Goal"
    ) : null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark col-sm-1 col-md-3 col-lg-auto",
        onClick: Handel_reset_modal,
        style: { margin: "5px", marginRight: "0", width: "189px" }
      },
      "Rest Budget"
    )), button.goal_acc ? /* @__PURE__ */ React.createElement("div", { className: "exp_div" }, /* @__PURE__ */ React.createElement("h4", { style: { marginLeft: "80px" } }, "Are you sure you want to reset your budget?"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark",
        style: { marginLeft: "230px" },
        onClick: Handel_reset
      },
      "Yes"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark",
        style: { marginLeft: "20px" },
        onClick: Handel_rejection
      },
      "No"
    )) : null, button.exp ? /* @__PURE__ */ React.createElement("div", { className: "exp_div" }, /* @__PURE__ */ React.createElement("h4", { style: { marginLeft: "90px" } }, "Add Expenses item"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        placeholder: "Item name",
        className: "form-control exp_inputs",
        id: "exp_item"
      }
    ), /* @__PURE__ */ React.createElement("select", { id: "exp_selection", className: "form-select exp_inputs" }, /* @__PURE__ */ React.createElement("option", { value: "", disabled: true, selected: true }, "Select Item Catagorie"), item.map((items, index) => /* @__PURE__ */ React.createElement("option", { key: index }, items.catagories))), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        className: "form-contorl exp_inputs",
        min: 1,
        id: "exp_price",
        placeholder: "Money Spent in $"
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark",
        style: { marginLeft: "140px" },
        onClick: Submit_exp
      },
      "Add Expensive item"
    )) : null, button.income ? /* @__PURE__ */ React.createElement("div", { className: "exp_div" }, /* @__PURE__ */ React.createElement("h4", { style: { marginLeft: "90px" } }, "Add Revenue Source"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "form-control exp_inputs",
        id: "income-name",
        placeholder: "Revenue name"
      }
    ), /* @__PURE__ */ React.createElement("select", { id: "income_selection", className: "form-select exp_inputs" }, /* @__PURE__ */ React.createElement("option", { value: "", selected: true, disabled: true }, "Select income Catagorie"), income.map((income2, index) => /* @__PURE__ */ React.createElement("option", { key: index }, income2.catagories))), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: 1,
        id: "revenue",
        placeholder: "Revenue achieved",
        className: "form-contorl exp_inputs"
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark",
        style: { marginLeft: "140px" },
        onClick: Submit_income
      },
      "Add Income Source"
    )) : null, button.goal ? /* @__PURE__ */ React.createElement("div", { className: "exp_div" }, /* @__PURE__ */ React.createElement("h4", { style: { marginLeft: "90px" }, min: 1 }, "Add Monthly Goal"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        placeholder: "Add Budget goal",
        className: "form-contorl exp_inputs",
        id: "goal"
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-dark",
        style: { marginLeft: "160px" },
        onClick: Add_goals
      },
      "Add Goal"
    )) : null, /* @__PURE__ */ React.createElement("hr", null));
  }
  ReactDOM.createRoot(document.querySelector("#Budget_div")).render(/* @__PURE__ */ React.createElement(Budget, null));
  function Budget_visualizing() {
    [Update, Setupdate] = React.useState(false);
    [data, Setdata] = React.useState({
      Expenses: [],
      Income: [],
      budget: 0,
      goal: "Not Assigned"
    });
    React.useEffect(() => {
      fetch("/budget/api/get/expenses").then((Response) => {
        if (!Response.ok) {
        } else {
          return Response.json();
        }
      }).then((expense) => {
        Setupdate(false);
        Setdata((prevState) => ({
          ...prevState,
          Expenses: expense.Expenses || []
        }));
      });
      fetch("/budget/api/get/income").then((Response) => {
        if (!Response.ok) {
        } else {
          return Response.json();
        }
      }).then((income) => {
        Setupdate(false);
        Setdata((prevState) => ({
          ...prevState,
          Income: income.Sources || []
        }));
      });
      fetch("/budget/api/status").then((Response) => Response.json()).then((budget) => {
        Setdata((prevState) => ({
          ...prevState,
          budget: budget.budget
        }));
      });
      fetch("/budget/api/get/goals").then((Response) => {
        if (Response.status === 202) {
          Setdata((prevState) => ({
            ...prevState,
            goal: "Not Assigned"
          }));
        } else {
          Setbutton({
            ...button,
            goal_btn: false
          });
        }
        return Response.json();
      }).then((goal) => {
        monthly_goal = goal["Monthly Goal"];
        console.log(monthly_goal);
        if (monthly_goal && monthly_goal.budget !== null && !isNaN(monthly_goal.budget) || monthly_goal === 0) {
          Setdata((prevState) => ({
            ...prevState,
            goal: `${goal["Monthly Goal"].budget}$`
          }));
        }
      });
    }, [Update]);
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: `stats_div ${data.budget > 0 ? "positive" : "negative"}` }, "Budget:", data.budget, "$"), /* @__PURE__ */ React.createElement("div", { className: "stats_div positive" }, "Goal:", data.goal), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("table", { className: "table table-dark table-hover custom-table first-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Expense"), /* @__PURE__ */ React.createElement("th", null, "Expenses Catagorie"), /* @__PURE__ */ React.createElement("th", null, "price"), /* @__PURE__ */ React.createElement("th", null, "at"))), /* @__PURE__ */ React.createElement("tbody", null, data.Expenses.map((expense, index) => /* @__PURE__ */ React.createElement("tr", { key: index }, /* @__PURE__ */ React.createElement("td", null, expense.item), /* @__PURE__ */ React.createElement("td", null, expense.Catagories), /* @__PURE__ */ React.createElement("td", null, expense.price), /* @__PURE__ */ React.createElement("td", null, expense.tracked_at))))), /* @__PURE__ */ React.createElement("table", { className: "table table-dark table-hover custom-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Income Source"), /* @__PURE__ */ React.createElement("th", null, "Source Catagorie"), /* @__PURE__ */ React.createElement("th", null, "Revenue"), /* @__PURE__ */ React.createElement("th", null, "at"))), /* @__PURE__ */ React.createElement("tbody", null, data.Income.map((income, index) => /* @__PURE__ */ React.createElement("tr", { key: index }, /* @__PURE__ */ React.createElement("td", null, income.source), /* @__PURE__ */ React.createElement("td", null, income.categories), /* @__PURE__ */ React.createElement("td", null, income.revenue), /* @__PURE__ */ React.createElement("td", null, income.tracked_at))))));
  }
  ReactDOM.createRoot(document.querySelector("#Budget_table")).render(
    /* @__PURE__ */ React.createElement(Budget_visualizing, null)
  );
})();
