import React from 'react';
import { View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { PieChartSeries } from '../hooks/useExpenseAnalytics';

type ExpensePieChartProps = {
  series: PieChartSeries[];
  size?: number;
};

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ series, size = 250 }) => {
  if (series.length === 0) {
    return null;
  }

  return (
    <View className="m-6">
      <PieChart
        widthAndHeight={size}
        series={series}
      />
    </View>
  );
};

export default ExpensePieChart;
