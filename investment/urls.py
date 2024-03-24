from django.urls import path
from . import views



urlpatterns = [
path("", views.index, name="index"),
path("register", views.register, name="register"),
path("login", views.log_in, name="login"),
path("logout", views.log_out, name='logout'),
path("stock", views.stock, name="stock"),
path("stock/<str:track>", views.stock_performance, name='stock_performance' ),
path("convert/currencys", views.currency, name='currency'),
path("budget/manage/", views.Budget, name='Budget'),

#api pathes
path("api/get_symbols", views.get_symbols, name='get_symbols'),
path("stock/api/save/symbol", views.add_track, name='add_track'),
path("stock/api/symbols", views.get_tracked, name='get_tracked'),
path("stock/api/remove/symbol", views.delete_tracker, name='delete_tracker'),
path("stock/api/symbols/<str:symbol>", views.search_symbol, name='search_symbol'),
path("stock/api/performance", views.check_performance, name='check_performance'),
path("stock/api/predict/<str:symbol>", views.predict, name='predict'),
path("stock/x/api/cache/stock/<str:symbol>/price", views.stocks_cach, name='cache_stocks'),
path("stock/x/api/cashe/save/price", views.add_caches, name='add_caches'),
#Currency api
path("currency/api/get", views.get_currencys, name='get_currencys'),
path("currency/x/api/cache", views.Cache_currencys, name='Cache_currency'),
path("currency/x/api/get", views.append_currency_cache, name='append_currency_cache'),
#Budget api
path("budget/api/get/expenses/catagories", views.get_catagories, name='get_catagories'),
path("budget/api/get/expenses", views.get_expenses, name='get_expenses'),
path("budget/api/add/expenses", views.Add_expenses, name='Add_expenses'),
path("budget/api/get/income/catagories", views.Get_income, name="Income"),
path("budget/api/get/income", views.Get_Sources, name='Get_Sources'),
path("budget/api/add/income", views.Add_income, name='Add_income'),
path('budget/api/status', views.Calculate_Budget, name='Calculate_Budget'),
path('budget/api/get/goals', views.Get_goals, name='get_goals'),
path('budget/api/add/goals', views.Set_goals, name='Set_goals'),
path('budget/api/reset', views.Reset_budget, name='Reset_budget')
]