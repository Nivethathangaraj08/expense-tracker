from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q, Sum, Avg, Max, Min, Count
from django.utils import timezone
from datetime import datetime, timedelta
import decimal

from .models import Expense, Budget
from .serializers import ExpenseSerializer, BudgetSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.all()
        category = self.request.query_params.get('category')
        payment_method = self.request.query_params.get('payment_method')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        search_term = self.request.query_params.get('search') or self.request.query_params.get('q')
        sort = self.request.query_params.get('sort', 'newest')

        if category and category != 'All':
            queryset = queryset.filter(category=category)
        if payment_method and payment_method != 'All':
            queryset = queryset.filter(payment_method=payment_method)
        if date_from:
            queryset = queryset.filter(expense_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(expense_date__lte=date_to)
        if min_amount:
            try:
                queryset = queryset.filter(amount__gte=float(min_amount))
            except ValueError:
                pass
        if max_amount:
            try:
                queryset = queryset.filter(amount__lte=float(max_amount))
            except ValueError:
                pass
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) |
                Q(expense_id__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(category__icontains=search_term) |
                Q(payment_method__icontains=search_term) |
                Q(notes__icontains=search_term)
            )

        if sort == 'oldest':
            queryset = queryset.order_by('expense_date', 'created_at')
        elif sort == 'highest':
            queryset = queryset.order_by('-amount')
        elif sort == 'lowest':
            queryset = queryset.order_by('amount')
        else:
            queryset = queryset.order_by('-expense_date', '-created_at')

        return queryset

    def perform_create(self, serializer):
        expense_id = self.request.data.get('expense_id')
        if not expense_id:
            count = Expense.objects.count() + 1
            expense_id = f"EXP{count:03d}"
            while Expense.objects.filter(expense_id=expense_id).exists():
                count += 1
                expense_id = f"EXP{count:03d}"
        serializer.save(expense_id=expense_id)

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        expenses = Expense.objects.filter(
            Q(title__icontains=query) |
            Q(expense_id__icontains=query) |
            Q(description__icontains=query) |
            Q(category__icontains=query) |
            Q(payment_method__icontains=query) |
            Q(notes__icontains=query)
        ).order_by('-expense_date')
        serializer = self.get_serializer(expenses, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def dashboard_stats(request):
    now = timezone.now().date()
    current_year = now.year
    current_month = now.month
    current_month_str = f"{current_year}-{current_month:02d}"

    # Total expenses
    all_expenses = Expense.objects.all()
    total_count = all_expenses.count()
    total_agg = all_expenses.aggregate(
        total=Sum('amount'),
        avg=Avg('amount'),
        highest=Max('amount'),
        lowest=Min('amount')
    )
    total_amount = float(total_agg['total'] or 0)
    avg_amount = float(total_agg['avg'] or 0)

    # Highest and lowest expenses
    highest_exp = Expense.objects.filter(amount=total_agg['highest']).first() if total_agg['highest'] else None
    lowest_exp = Expense.objects.filter(amount=total_agg['lowest']).first() if total_agg['lowest'] else None

    # This Month
    this_month_expenses = float(
        all_expenses.filter(expense_date__year=current_year, expense_date__month=current_month)
        .aggregate(total=Sum('amount'))['total'] or 0
    )

    # This Week (last 7 days)
    week_start = now - timedelta(days=now.weekday())
    this_week_expenses = float(
        all_expenses.filter(expense_date__gte=week_start)
        .aggregate(total=Sum('amount'))['total'] or 0
    )

    # Category Breakdown
    cat_counts = all_expenses.values('category').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')

    category_breakdown = []
    for item in cat_counts:
        tot = float(item['total'] or 0)
        pct = (tot / total_amount * 100) if total_amount > 0 else 0
        category_breakdown.append({
            'category': item['category'],
            'total': tot,
            'count': item['count'],
            'percentage': round(pct, 1)
        })

    # Payment Method Breakdown
    pm_counts = all_expenses.values('payment_method').annotate(
        total=Sum('amount'),
        count=Count('id')
    ).order_by('-total')

    payment_breakdown = []
    for item in pm_counts:
        tot = float(item['total'] or 0)
        pct = (tot / total_amount * 100) if total_amount > 0 else 0
        payment_breakdown.append({
            'method': item['payment_method'],
            'total': tot,
            'count': item['count'],
            'percentage': round(pct, 1)
        })

    # Monthly Trends
    monthly_trends = []
    for m in range(1, 13):
        m_tot = all_expenses.filter(expense_date__year=current_year, expense_date__month=m).aggregate(Sum('amount'))['amount__sum'] or 0
        monthly_trends.append({
            'month': f"{current_year}-{m:02d}",
            'total': float(m_tot)
        })

    # Budget info
    budget_obj = Budget.objects.filter(month=current_month, year=current_year).first()
    monthly_budget = float(budget_obj.amount) if budget_obj else 50000.0
    remaining_budget = max(0.0, monthly_budget - this_month_expenses)
    budget_used_percentage = (this_month_expenses / monthly_budget * 100) if monthly_budget > 0 else 0

    return Response({
        'summary': {
            'totalExpenses': round(total_amount, 2),
            'thisMonthExpenses': round(this_month_expenses, 2),
            'thisWeekExpenses': round(this_week_expenses, 2),
            'totalTransactions': total_count,
            'averageExpense': round(avg_amount, 2),
            'highestExpense': ExpenseSerializer(highest_exp).data if highest_exp else None,
            'lowestExpense': ExpenseSerializer(lowest_exp).data if lowest_exp else None,
        },
        'budget': {
            'monthlyBudget': monthly_budget,
            'thisMonthExpenses': round(this_month_expenses, 2),
            'remainingBudget': round(remaining_budget, 2),
            'budgetUsedPercentage': round(budget_used_percentage, 1),
            'isOverBudget': this_month_expenses > monthly_budget,
            'month': current_month,
            'year': current_year,
        },
        'categoryBreakdown': category_breakdown,
        'paymentMethodBreakdown': payment_breakdown,
        'monthlyTrends': monthly_trends,
    })


@api_view(['GET', 'POST'])
def budget_view(request):
    now = timezone.now().date()
    month = int(request.query_params.get('month', now.month))
    year = int(request.query_params.get('year', now.year))

    if request.method == 'GET':
        budget_obj = Budget.objects.filter(month=month, year=year).first()
        monthly_budget = float(budget_obj.amount) if budget_obj else 50000.0
        spent = float(Expense.objects.filter(expense_date__year=year, expense_date__month=month).aggregate(Sum('amount'))['amount__sum'] or 0)
        remaining = max(0.0, monthly_budget - spent)
        pct = (spent / monthly_budget * 100) if monthly_budget > 0 else 0

        return Response({
            'month': month,
            'year': year,
            'amount': monthly_budget,
            'spent': round(spent, 2),
            'remaining': round(remaining, 2),
            'percentage': round(pct, 1),
            'isOverBudget': spent > monthly_budget
        })

    elif request.method == 'POST':
        amount = request.data.get('amount')
        if not amount or float(amount) <= 0:
            return Response({'error': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

        req_month = int(request.data.get('month', month))
        req_year = int(request.data.get('year', year))

        budget_obj, _ = Budget.objects.update_or_create(
            month=req_month,
            year=req_year,
            defaults={'amount': float(amount)}
        )

        spent = float(Expense.objects.filter(expense_date__year=req_year, expense_date__month=req_month).aggregate(Sum('amount'))['amount__sum'] or 0)
        remaining = max(0.0, float(amount) - spent)
        pct = (spent / float(amount) * 100) if float(amount) > 0 else 0

        return Response({
            'month': req_month,
            'year': req_year,
            'amount': float(amount),
            'spent': round(spent, 2),
            'remaining': round(remaining, 2),
            'percentage': round(pct, 1),
            'isOverBudget': spent > float(amount)
        })
