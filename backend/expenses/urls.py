from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, dashboard_stats, budget_view

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('stats/dashboard/', dashboard_stats, name='dashboard-stats'),
    path('stats/dashboard', dashboard_stats),
    path('budget/', budget_view, name='budget-detail'),
    path('budget', budget_view),
    path('', include(router.urls)),
]
