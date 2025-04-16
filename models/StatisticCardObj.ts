class StatisticCardObj {
  title: string;
  value: string;
  icon: string;
  unit: string;
  normalRange: {
    low: number;
    high: number;
  };
  criticalText: {
    low: string;
    high: string;
  };

  constructor(
    title: string,
    value: string,
    icon: string,
    unit: string,
    normalRange: { low: number; high: number },
    criticalText: { low: string; high: string }
  ) {
    this.title = title;
    this.value = value;
    this.icon = icon;
    this.unit = unit;
    this.normalRange = normalRange;
    this.criticalText = criticalText;
  }
}

export default StatisticCardObj;
