from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Transportation', 'Transportation'),
        ('Shopping', 'Shopping'),
        ('Bills', 'Bills'),
        ('Entertainment', 'Entertainment'),
        ('Healthcare', 'Healthcare'),
        ('Education', 'Education'),
        ('Travel', 'Travel'),
        ('Rent', 'Rent'),
        ('Other', 'Other'),
    ]

    PAYMENT_CHOICES = [
        ('Cash', 'Cash'),
        ('Credit Card', 'Credit Card'),
        ('Debit Card', 'Debit Card'),
        ('UPI', 'UPI'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Other', 'Other'),
    ]

    expense_id = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_CHOICES)
    expense_date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return f"{self.expense_id} - {self.title} (₹{self.amount})"


class Budget(models.Model):
    month = models.PositiveSmallIntegerField(help_text="Month number 1-12")
    year = models.PositiveIntegerField(help_text="Four digit calendar year")
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Allocated expenditure limit"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('month', 'year')
        ordering = ['-year', '-month']

    def __str__(self):
        return f"Budget {self.month}/{self.year}: ₹{self.amount}"
