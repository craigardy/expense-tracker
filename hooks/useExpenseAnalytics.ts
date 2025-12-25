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
  color: string;
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
    const hue = 360 / Object.keys(totalsByCategory).length;
    return Object.entries(totalsByCategory).map(([categoryId, amount], index) => {
      const name = categoryIdToName[categoryId] || 'Unknown';
      const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
      const color = `hsl(${index * hue}, 85%, 55%)`;
      return {
        name,
        amount,
        percentage,
        color,
      };
    });
  }, [totalsByCategory, categoryIdToName, totalAmount]);

  const series = useMemo(() => {
    if (categoryData.length === 0) return [];
    return categoryData.map((item) => ({
      value: item.amount,
      // label: {
      //   text: `${item.percentage.toFixed(1)}%`,
      //   fill: 'black',
      //   fontSize: 14,
      //   fontWeight: 'bold',
      // },
      color: item.color,
    }));
  }, [categoryData]);

  return {
    totalAmount,
    categoryData,
    series,
  };
};

export type { CategoryData, PieChartSeries };
