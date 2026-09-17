from django.contrib import admin
from .models import Expense, Budget

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'expense_id',
        'title',
        'amount',
        'category',
        'payment_method',
        'expense_date',
        'created_at',
    )
    list_filter = ('category', 'payment_method', 'expense_date')
    search_fields = ('expense_id', 'title', 'description', 'notes')
    date_hierarchy = 'expense_date'
    ordering = ('-expense_date', '-created_at')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('month', 'year', 'amount', 'updated_at')
    list_filter = ('year', 'month')
    ordering = ('-year', '-month')
