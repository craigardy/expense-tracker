import { useMemo } from 'react';

type Expense = {
  $id: string;
  category: string;
  amount: number;
  [key: string]: any;
};

type Category = {
  $id: string;
  name: string;
  [key: string]: any;
};

type CategoryData = {
  name: string;
  amount: number;
  percentage: number;
};

type PieChartSeries = {
  value: number;
  color: string;
  label: {
    text: string;
    fill: string;
    fontSize: number;
    fontWeight: string;
  };
};

export const useExpenseAnalytics = (expenses: Expense[] | null, categories: Category[] | null) => {
  type TotalsByCategory = {
    [category: string]: number;
  };

  const { totalsByCategory, totalAmount, categoryIdToName } = useMemo(() => {
    if (!expenses || !categories || expenses.length === 0) {
      return {
        totalsByCategory: {},
        totalAmount: 0,
        categoryIdToName: {},
      };
    }

    // Calculate totals by category
    const totals: TotalsByCategory = {};
    let total = 0;
    
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      total += expense.amount;
    });

    // Convert category IDs to names
    const idToName = Object.fromEntries(
      categories.map(cat => [cat.$id, cat.name])
    );

    return {
      totalsByCategory: totals,
      totalAmount: total,
      categoryIdToName: idToName,
    };
  }, [expenses, categories]);

  const categoryData = useMemo(() => {
    return Object.entries(totalsByCategory).map(([categoryId, amount]) => {
      const name = categoryIdToName[categoryId] || 'Unknown';
      const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
      return {
        name,
        amount,
        percentage,
      };
    });
  }, [totalsByCategory, categoryIdToName, totalAmount]);

  const series = useMemo(() => {
    if (categoryData.length === 0) return [];
    const hue = 360 / categoryData.length;
    return categoryData.map((item, index) => ({
      value: item.amount,
      color: `hsl(${index * hue}, 85%, 55%)`,
      label: { text: item.name, fill: 'black', fontSize: 12, fontWeight: 'bold' },
    }));
  }, [categoryData]);

  return {
    totalAmount,
    categoryData,
    series,
  };
};

export type { CategoryData, PieChartSeries };
