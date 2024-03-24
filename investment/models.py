from django.db import models
from django.contrib.auth.models import AbstractUser
from uuid import uuid4
from django.utils import timezone

# Create your models here.


class User(AbstractUser):

    id = models.UUIDField(default=uuid4, primary_key=True)


class Symbol(models.Model):

    symbol = models.CharField(max_length=30)

    company = models.CharField(max_length=250)

    Market_Cap = models.CharField(max_length=250)

    IPO_Year = models.CharField(max_length=100)

    Volume = models.CharField(max_length=250)

    Industry = models.CharField(max_length=150)

    def serialize(self):

        return {"symbol": self.symbol, "company": self.company}

    def __str__(self):

        return f"{self.company}({self.symbol})"


class tracker(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid4)

    user = models.ForeignKey(
        User, related_name="tracking_user", on_delete=models.CASCADE
    )

    symbol = models.ForeignKey(
        Symbol, related_name="tracked_symbol", on_delete=models.CASCADE
    )

    ammount = models.IntegerField()

    price = models.CharField(max_length=255)

    tracked_at = models.DateTimeField(default=timezone.now)

    def serialize(self):

        return {
            "symbol_info": {
                "symbol": self.symbol.symbol,
                "company": self.symbol.company,
            },
            "ammount": self.ammount,
            "price": self.price,
            "net_price": int(round(self.ammount * float(self.price))),
            "tracked_at": self.tracked_at.strftime("%b %d %Y "),
        }


class Cache_stocks(models.Model):

    symbol = models.ForeignKey(Symbol, on_delete=models.CASCADE)

    prices = models.JSONField()

    trading_day = models.DateField(default=timezone.now())

    def serialize(self):

        return {"prices": self.prices, "at": str(self.trading_day)}


class Currency(models.Model):

    symbol = models.CharField(max_length=30)

    Country = models.CharField(max_length=150)

    def serialize(self):

        return {"symbol": self.symbol, "country": self.Country}


class Cache_currency(models.Model):

    prices = models.JSONField()

    trading_day = models.DateField(default=timezone.now())

    def serialize(self):

        return {"prices": self.prices, "Cached_day": self.trading_day}


class Expensive(models.Model):

    catagories = models.CharField(max_length=155)

    def serialize(self):

        return {"catagories": self.catagories}


class Expenses_trackers(models.Model):

    items = models.CharField(max_length=200)

    price = models.IntegerField()

    Catagories = models.ForeignKey(Expensive, on_delete=models.CASCADE)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    tracked_at = models.DateField(default=timezone.now())

    def serialize(self):

        return {
            "item": self.items,
            "price": self.price,
            "Catagories": self.Catagories.catagories,
            "user": self.user.username,
            "tracked_at": self.tracked_at,
        }


class Income(models.Model):

    catagories = models.CharField(max_length=250)

    def serialize(self):

        return {"catagories": self.catagories}


class Income_tracker(models.Model):

    income_source = models.CharField(max_length=300)

    revenue = models.IntegerField()

    categories = models.ForeignKey(Income, on_delete=models.CASCADE)

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    tracked_at = models.DateField(default=timezone.now())

    def serialize(self):

        return {
            "source": self.income_source,
            "revenue": self.revenue,
            "categories": self.categories.catagories,
            "user": self.user.username,
            "tracked_at": self.tracked_at,
        }


class Goals(models.Model):

    budget = models.IntegerField()

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    date = models.DateField(default=timezone.now())

    def serialize(self):

        return {"budget": self.budget, "user": self.user.username, "at": self.date}
