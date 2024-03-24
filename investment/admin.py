from django.contrib import admin
from .models import User, Symbol, tracker, Cache_stocks, Currency, Cache_currency,Expensive, Expenses_trackers, Income, Income_tracker,Goals

# Register your models here.

admin.site.register(User)
admin.site.register(Symbol)
admin.site.register(tracker)
admin.site.register(Cache_stocks)
admin.site.register(Currency)
admin.site.register(Cache_currency)
admin.site.register(Expensive)
admin.site.register(Expenses_trackers)
admin.site.register(Income)
admin.site.register(Income_tracker),
admin.site.register(Goals)