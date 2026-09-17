from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
from .models import Expense, Budget

class ExpenseAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_expense = Expense.objects.create(
            expense_id="EXP001",
            title="Supermarket Groceries",
            description="Weekly groceries and fruits",
            amount=1500.00,
            category="Food",
            payment_method="UPI",
            expense_date="2026-09-15",
            notes="Cashback received"
        )
        self.expense2 = Expense.objects.create(
            expense_id="EXP002",
            title="Metro Monthly Smart Card",
            amount=800.00,
            category="Transportation",
            payment_method="Debit Card",
            expense_date="2026-09-16"
        )

    # 1. Test add expense
    def test_add_expense(self):
        payload = {
            "title": "College Textbooks",
            "amount": 1200.00,
            "category": "Education",
            "payment_method": "UPI",
            "expense_date": "2026-09-17"
        }
        res = self.client.post('/api/expenses/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['title'], "College Textbooks")
        self.assertEqual(float(res.data['amount']), 1200.00)

    # 2. Test view expenses
    def test_view_all_expenses(self):
        res = self.client.get('/api/expenses/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 2)

    # 3. Test view expense details
    def test_view_expense_detail(self):
        res = self.client.get(f'/api/expenses/{self.valid_expense.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['expense_id'], "EXP001")

    # 4. Test update expense
    def test_update_expense(self):
        payload = {
            "title": "Supermarket Groceries (Organic)",
            "amount": 1850.00,
            "category": "Food",
            "payment_method": "Credit Card",
            "expense_date": "2026-09-15"
        }
        res = self.client.put(f'/api/expenses/{self.valid_expense.id}/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(float(res.data['amount']), 1850.00)

    # 5. Test delete expense
    def test_delete_expense(self):
        res = self.client.delete(f'/api/expenses/{self.valid_expense.id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Expense.objects.filter(id=self.valid_expense.id).exists())

    # 6. Test search expense
    def test_search_expense(self):
        res = self.client.get('/api/expenses/search/?q=Groceries')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['expense_id'], "EXP001")

    # 7. Test filter by category
    def test_filter_by_category(self):
        res = self.client.get('/api/expenses/?category=Transportation')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['category'], "Transportation")

    # 8. Test filter by payment method
    def test_filter_by_payment_method(self):
        res = self.client.get('/api/expenses/?payment_method=Debit Card')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['payment_method'], "Debit Card")

    # 9. Test filter by date range
    def test_filter_by_date_range(self):
        res = self.client.get('/api/expenses/?date_from=2026-09-16&date_to=2026-09-17')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]['expense_id'], "EXP002")

    # 10. Test validation (empty title)
    def test_validation_empty_title(self):
        payload = {
            "title": "   ",
            "amount": 250.00,
            "category": "Food",
            "payment_method": "Cash",
            "expense_date": "2026-09-17"
        }
        res = self.client.post('/api/expenses/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # 11. Test validation (negative amount)
    def test_validation_negative_amount(self):
        payload = {
            "title": "Negative Test",
            "amount": -50.00,
            "category": "Food",
            "payment_method": "Cash",
            "expense_date": "2026-09-17"
        }
        res = self.client.post('/api/expenses/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # 12. Test validation (invalid category)
    def test_validation_invalid_category(self):
        payload = {
            "title": "Invalid Cat",
            "amount": 100.00,
            "category": "NonExistentCategory",
            "payment_method": "Cash",
            "expense_date": "2026-09-17"
        }
        res = self.client.post('/api/expenses/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    # 13. Test total expense calculation
    def test_total_expense_calculation(self):
        res = self.client.get('/api/stats/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        expected_total = 1500.00 + 800.00
        self.assertEqual(res.data['summary']['totalExpenses'], expected_total)

    # 14. Test monthly expense calculation
    def test_monthly_expense_calculation(self):
        res = self.client.get('/api/stats/dashboard/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('thisMonthExpenses', res.data['summary'])

    # 15. Test budget limit calculation
    def test_budget_limit_calculation(self):
        Budget.objects.create(month=9, year=2026, amount=2000.00)
        res = self.client.get('/api/budget/?month=9&year=2026')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['amount'], 2000.00)
        self.assertTrue(res.data['isOverBudget'])  # 2300 > 2000

    # 16. Test 404 on nonexistent expense
    def test_nonexistent_expense_404(self):
        res = self.client.get('/api/expenses/99999/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)
