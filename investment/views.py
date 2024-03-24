from django.shortcuts import render, HttpResponse, redirect
from django.contrib.auth import logout, login, authenticate
from django.contrib import messages
from .models import (
    User,
    Symbol,
    tracker,
    Cache_stocks,
    Currency,
    Cache_currency,
    Expensive,
    Expenses_trackers,
    Income,
    Income_tracker,
    Goals,
)
from django.db import IntegrityError
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.utils.timezone import make_aware, make_naive
from django.db.models import Sum
import json
import torch
from datetime import datetime
from investment.helper import NeuralNetwork


# Create your views here.
@login_required(redirect_field_name="login")
def index(request):

    return render(request, "investment/index.html", {"section": "Home"})


def log_in(request):
    if request.method == "POST":

        name = request.POST.get("username", "")

        password = request.POST.get("password", "")

        if not name and not password:

            messages.warning(request, "Please fill password and username fields!")

            return redirect("login")

        user = authenticate(request, username=name, password=password)

        if user is not None:

            login(request, user)

            messages.success(request, "Signed into your account successfully")

            return redirect("index")

        else:

            messages.warning(request, "User not found.")

            return redirect("login")

    return render(request, "investment/login.html", {"section": "Login"})


def register(request):

    if request.method == "POST":

        name = request.POST.get("username", "")

        email = request.POST.get("email", "")

        password = request.POST.get("password", "")

        confirm_pass = request.POST.get("confirm", "")

        if not name or not email:

            messages.success(request, "Please fill username and email field")

            return redirect("register")

        if not password or not confirm_pass or password != confirm_pass:

            messages.success(request, "Passwords do not match.")

            return redirect("register")

        try:

            user = User.objects.create_user(
                username=name, email=email, password=password
            )

            user.save()

        except IntegrityError:

            messages.error(request, "Username/email is already taken.")

            return redirect("register")

        messages.success(request, "Registered your account successfully")

        return redirect("login")

    return render(request, "investment/register.html", {"section": "Register"})


def log_out(request):

    logout(request)

    return redirect("login")


"""

feature 1: Stocks Tracking

"""


@login_required(redirect_field_name="login")
def stock(request):

    return render(request, "investment/invest.html", {"section": "stocks"})


@login_required(redirect_field_name="login")
def get_symbols(request):

    if request.method == "GET":

        try:
            get_symbol = Symbol.objects.all()

        except Symbol.DoesNotExist:
            # just in case of error
            return JsonResponse(
                {"error": "Something went wrong in the data base"}, status=404
            )

        serialize_symbols = [symbol.serialize() for symbol in get_symbol]

        return JsonResponse({"Stock": serialize_symbols}, status=200)

    else:

        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def add_track(request):

    if request.method == "POST":

        # get body data from jsx
        data = json.loads(request.body)

        symbol = data.get("symbol")

        ammount = data.get("ammount")

        get_price = data.get("price")
        print(data)
        # check if valid symbol
        if symbol == "" or ammount == "":

            return JsonResponse({"error": "Recived invalid data"}, status=404)

        try:

            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"error": "Not supported symbol"}, status=404)

        # check if user requesting to track the same stock he already tracks
        try:
            is_tracked = tracker.objects.get(
                user=request.user,
                symbol=is_symbol,
                tracked_at__date=timezone.now().date(),
                price=get_price,
            )

            is_tracked.ammount = is_tracked.ammount + int(ammount)

            is_tracked.save()

            # track new investment if on another day
        except tracker.DoesNotExist:

            new_stock = tracker(
                user=request.user, symbol=is_symbol, ammount=ammount, price=get_price
            )

            new_stock.save()

        return JsonResponse(
            {"message": "Started tracking your investment in stocks"}, status=200
        )

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def get_tracked(request):

    if request.method == "GET":

        # check if there are symbols
        try:
            get_tracked_symbols = tracker.objects.filter(user=request.user)

        except tracker.DoesNotExist:

            return JsonResponse({"message": "you have no tracked symbols"}, status=202)

        # serialize to json form
        serialized_track = [symbols.serialize() for symbols in get_tracked_symbols]

        return JsonResponse({"tracked_stocks": serialized_track}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def stock_performance(request, track):

    if request.method == "GET":

        try:

            symbol = Symbol.objects.get(symbol=track)

        except symbol.DoesNotExist:

            return JsonResponse({"error": "Not supported symbol"}, status=404)

        try:
            is_tracked = tracker.objects.filter(symbol=symbol, user=request.user)

        except tracker.DoesNotExist:

            messages.warning(request, "User does not have this symbol tracked")

            return redirect("index")

        return render(
            request,
            "investment/performance_stock.html",
            {"section": track, "stock": symbol, "track_performance": is_tracked},
        )

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


def search_symbol(request, symbol):

    if request.method == "GET":

        # check if the symbol is supported
        try:
            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"traked_symbols": []}, status=202)

        # check if user tracked this symbol
        try:
            get_tracked_symbols = tracker.objects.filter(
                symbol=is_symbol, user=request.user
            )

        except tracker.DoesNotExist:

            return JsonResponse({"traked_symbols": []}, status=202)

        serialized_symbols = [symbol.serialize() for symbol in get_tracked_symbols]

        return JsonResponse({"traked_symbols": serialized_symbols}, status=200)

    else:

        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def check_performance(request):

    if request.method == "POST":

        data = json.loads(request.body)

        stock_info = data.get("stock_info")

        if not stock_info:

            return JsonResponse({"error": "Insufficient data"}, status=400)

        try:

            is_symbol = Symbol.objects.get(symbol=stock_info["01. symbol"])

        except Symbol.DoesNotExist:

            return JsonResponse({"error": "Not supported symbol"}, status=404)

        try:
            get_tracked = tracker.objects.filter(symbol=is_symbol, user=request.user)

        except tracker.DoesNotExist:

            return JsonResponse(
                {"message": "user is not tracked this stock"}, status=404
            )

        amount_stocks = get_tracked.aggregate(total_amount=Sum("ammount"))[
            "total_amount"
        ]

        current_price = stock_info["05. price"]

        netcost = int(
            sum(float(stock.price) * int(stock.ammount) for stock in get_tracked)
        )

        if all(current_price == stock.price for stock in get_tracked):

            return JsonResponse({"total_profit": "0$", "profit_per": "0%"}, status=200)

        if current_price and netcost and current_price:

            total_profit = float(current_price) * int(amount_stocks) - netcost

            profit_percentage = (total_profit / netcost) * 100

            return JsonResponse(
                {
                    "total_profit": f"{round(total_profit, 2)}$",
                    "profit_per": f"{round(profit_percentage, 2)}%",
                },
                status=200,
            )

        else:
            return JsonResponse({"error": "Insufficient data?"}, status=400)

    else:

        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def predict(request, symbol):

    if request.method == "GET":

        if symbol.strip() == "":

            return JsonResponse({"error": "Insufficient data"}, status=400)

        try:
            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"error": "Not supported symbol"}, status=404)

        # load my own alpha version ai model for prediction

        model = NeuralNetwork()

        model.load_state_dict(torch.load("investment/investai.pth"), strict=False)

        model.eval()

        market_cap = float(is_symbol.Market_Cap)

        try:
            ipo_year = int(is_symbol.IPO_Year) if is_symbol.IPO_Year else 0

        except ValueError:

            ipo_year = 0

        volume = float(is_symbol.Volume)

        input_data = [market_cap, ipo_year, volume]

        padding_size = 150 - len(input_data)

        padded_input = input_data + [0] * padding_size

        input_tensor = torch.tensor(padded_input, dtype=torch.float32)

        output = model(input_tensor)

        predicted_name = int(torch.argmax(output, dim=0).item())

        if predicted_name == 0:

            prediction = "Buy"

        elif predicted_name == 1:

            prediction = "Sell"

        elif predicted_name == 2:

            prediction = "Hold"
        else:

            prediction = "Not sure"

        return JsonResponse({"prediction": prediction}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def stocks_cach(request, symbol):

    if request.method == "GET":

        try:
            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"error": "Not Supported symbol"}, status=404)

        # Check if the symbol is cached this day
        try:

            Is_cashed = Cache_stocks.objects.get(
                symbol=is_symbol, trading_day=timezone.now()
            )

        except Cache_stocks.DoesNotExist:

            return JsonResponse(
                {"error": "Couldn't find cache for this symbol"}, status=202
            )

        serialized_cache = Is_cashed.serialize()

        return JsonResponse(serialized_cache, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


def add_caches(request):

    if request.method == "POST":

        data = json.loads(request.body)

        cache_data = data.get("cashe")

        print(cache_data)

        if not cache_data:

            return JsonResponse({"error": "Insufficient data"}, status=400)

        # Get the needed data
        symbol = cache_data["01. symbol"]

        # Check if supported symbol
        try:

            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"error: Not Supported symbol"}, status=404)

        # Check if this symbol is cashed this day
        try:

            is_cashed = Cache_stocks.objects.get(
                symbol=is_symbol, trading_day=timezone.now()
            )

            return JsonResponse({"error": "This symbol is already cached"}, status=202)

        except Cache_stocks.DoesNotExist:
            pass

        # Cache the price data
        cache_symbol = Cache_stocks(symbol=is_symbol, prices=cache_data)

        cache_symbol.save()

        return JsonResponse({"message": "Caching successed"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def delete_tracker(request):

    if request.method == "DELETE":

        try:
            data = json.loads(request.body)

        except ValueError:

            return JsonResponse({"error": "Insufficient data"}, status=400)

        symbol = data.get("symbol").strip()

        at = data.get("date").strip()

        at = datetime.strptime(at, "%b %d %Y")

        at = make_aware(at)

        try:
            is_symbol = Symbol.objects.get(symbol=symbol)

        except Symbol.DoesNotExist:

            return JsonResponse({"error": "Not Supported symbol"}, status=404)

        try:
            is_tracked = tracker.objects.get(
                user=request.user, symbol=is_symbol, tracked_at__date=at
            )

        except tracker.DoesNotExist:

            return JsonResponse({"error": "Invalid tracked stock"}, status=404)

        is_tracked.delete()

        return JsonResponse({"message": "Trakcer Remove Successfully"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


"""

feature 2: Currency Conversion

"""


@login_required(redirect_field_name="login")
def currency(request):

    return render(request, "investment/currency.html", {"section": "Convert Currencys"})


@login_required(redirect_field_name="login")
def get_currencys(request):

    if request.method == "GET":

        try:

            get_symbols = Currency.objects.all()

        except Currency.DoesNotExist:
            # Error in database
            return JsonResponse({"Currencys": []}, status=200)

        # Serialize currency for json
        serialize_currencys = [currency.serialize() for currency in get_symbols]

        return JsonResponse({"Currencys": serialize_currencys}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Cache_currencys(request):

    if request.method == "GET":

        try:

            is_cached = Cache_currency.objects.get(trading_day=timezone.now())

        except Cache_currency.DoesNotExist:

            return JsonResponse(
                {"error": "Couldn't find any currency caches saved today."}, status=202
            )

        # serialize cache to json formate
        serialized_cache = is_cached.serialize()

        return JsonResponse(serialized_cache, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def append_currency_cache(request):

    if request.method == "POST":

        # Check if there already cache for currencys
        try:
            is_cached = Cache_currency.objects.get(trading_day=timezone.now())

            return JsonResponse({"error": "This symbol is already cached"}, status=202)
        except Cache_currency.DoesNotExist:
            pass

        try:
            data = json.loads(request.body)

        except ValueError:

            return JsonResponse({"error": "Comunication error"}, status=400)

        prices = data["prices"]

        if not prices:

            return JsonResponse({"error": "Insufficient data"}, status=400)

        # cache the prices for today
        append_cache = Cache_currency(prices=prices)

        append_cache.save()

        return JsonResponse({"message": "Successfly cached today prices"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


"""

feature 3: Budget Management

"""


def Budget(request):

    return render(
        request, "investment/budget_managment.html", {"section": "Budget Managment"}
    )


def get_catagories(request):

    if request.method == "GET":

        # Get all expensives catagories
        try:
            get_items = Expensive.objects.all()

        except Expensive.DoesNotExist:
            return JsonResponse({"error": "Error in database"}, status=404)

        serialize_item = [item.serialize() for item in get_items]

        return JsonResponse({"catagories": serialize_item}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def get_expenses(request):

    if request.method == "GET":

        # check if user have tracked any expensive for this month
        try:
            is_tracked = Expenses_trackers.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Expenses_trackers.DoesNotExist:

            return JsonResponse({"Expenses": []}, status=202)

        # serialize expenses to json form
        serialize_expenses = [item.serialize() for item in is_tracked]

        return JsonResponse({"Expenses": serialize_expenses}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Add_expenses(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

        except ValueError:

            return JsonResponse({"error": "Api communication failed"}, status=400)

        item = data.get("item")

        catagories = data.get("catagories")

        price = data.get("price")

        # Check if supported catagory of expenses
        try:
            is_supported_catagory = Expensive.objects.get(catagories=catagories)

        except Expensive.DoesNotExist:

            return JsonResponse({"error": "Unknown Catagory"}, status=404)

        # add expenses to database
        append_expense = Expenses_trackers(
            items=item, Catagories=is_supported_catagory, user=request.user, price=price
        )

        append_expense.save()

        return JsonResponse({"message": "Added Expense item"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


def Get_income(request):

    if request.method == "GET":

        try:
            get_source = Income.objects.all()

        except Income.DoesNotExist:

            return JsonResponse({"Sources_Catagories": []}, status=202)

        serialize_source = [source.serialize() for source in get_source]

        return JsonResponse({"Sources_Catagories": serialize_source}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Get_Sources(request):

    if request.method == "GET":

        try:
            is_tracked = Income_tracker.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Income_tracker.DoesNotExist:

            return JsonResponse({"Sources": []}, status=202)

        # serialize tracker to json form
        serialize_tracker = [tracked.serialize() for tracked in is_tracked]

        return JsonResponse({"Sources": serialize_tracker}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Add_income(request):

    if request.method == "POST":
        # Get body of the request json body
        try:
            data = json.loads(request.body)

        except ValueError:

            return JsonResponse({"error": "Api communication failed"}, status=400)

        # Get the values submited
        revenue_name = data.get("revenue_name")

        revenue_catagory = data.get("revenue_catagory")

        revenue = data.get("revenue_achieved")

        try:
            get_catagorie = Income.objects.get(catagories=revenue_catagory)

        except Income.DoesNotExist:

            return JsonResponse({"error": "Api communication failed"}, status=400)

        # Save income in database
        append_income = Income_tracker(
            income_source=revenue_name,
            revenue=revenue,
            categories=get_catagorie,
            user=request.user,
        )

        append_income.save()

        return JsonResponse({"message": "Added Income source"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Calculate_Budget(request):

    if request.method == "GET":

        # Get all expenses and income of this month
        try:
            get_expense = Expenses_trackers.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Expenses_trackers.DoesNotExist:

            get_expense = []

        try:
            get_revenue = Income_tracker.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Income_tracker.DoesNotExist:

            get_revenue = []

        # Get total expense and income and make sure no value error
        total_expense = get_expense.aggregate(total_exp=Sum("price"))["total_exp"]

        if total_expense == None:

            total_expense = 0

        total_revenue = get_revenue.aggregate(total_rev=Sum("revenue"))["total_rev"]

        if total_revenue == None:

            total_revenue = 0

        # Calculate the budget
        budget = total_revenue - total_expense

        return JsonResponse({"budget": budget}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Get_goals(request):

    if request.method == "GET":

        # Checks if there goal seted this month
        try:

            is_goals = Goals.objects.get(
                user=request.user,
                date__month=timezone.now().month,
                date__year=timezone.now().year,
            )
        except Goals.DoesNotExist:

            return JsonResponse({"Monthly Goal": "Not Assigned"}, status=202)

        # Serialize the monthly goal to json form
        serialize_goal = is_goals.serialize()

        return JsonResponse({"Monthly Goal": serialize_goal}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Set_goals(request):

    if request.method == "POST":

        # Check if there's already a goal set for this month
        try:
            is_seted = Goals.objects.get(
                user=request.user,
                date__month=timezone.now().month,
                date__year=timezone.now().year,
            )

            return JsonResponse(
                {
                    "error": "Rejected, you can't set another budget goal this month."
                    "Please remove your old goal first"
                },
                status=400,
            )
        except Goals.DoesNotExist:

            pass

        # Check if json request is valid
        try:
            data = json.loads(request.body)

        except ValueError:

            return JsonResponse({"error": "Api communication failed"}, status=400)

        budget = data.get("budget_goal")

        if int(budget.strip()) < 0:

            return JsonResponse(
                {"error": "Budget goal should be positive integer"}, status=400
            )

        # Save goal
        add_goal = Goals(budget=budget, user=request.user)

        add_goal.save()

        return JsonResponse({"message": "Goals assigned successfully"}, status=200)

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)


@login_required(redirect_field_name="login")
def Reset_budget(request):

    if request.method == "DELETE":

        # Get all tracked expenses for this month if exist
        try:
            is_expenses = Expenses_trackers.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Expenses_trackers.DoesNotExist:

            is_expenses = None

        # Get all tracked income for this month if exist
        try:
            is_income = Income_tracker.objects.filter(
                user=request.user,
                tracked_at__month=timezone.now().month,
                tracked_at__year=timezone.now().year,
            )

        except Income_tracker.DoesNotExist:

            is_income = None

        # Get tracked goal for this month if exist
        try:
            is_goal = Goals.objects.get(
                user=request.user,
                date__month=timezone.now().month,
                date__year=timezone.now().year,
            )

        except Goals.DoesNotExist:

            is_goal = None

        # Delete all items from data base if exists
        if is_expenses is not None:

            [expense.delete() for expense in is_expenses]

        if is_goal is not None:

            is_goal.delete()

        if is_income is not None:

            [income.delete() for income in is_income]

        return JsonResponse(
            {"error": "Successfly deleted your budget trackers"}, status=200
        )

    else:
        return JsonResponse({"error": "Not allowed method"}, status=405)
