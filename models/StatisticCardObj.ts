class StatisticCardObj {
  title: string;
  text: string;
  icon: string;
  normalRange: string;

  constructor(title: string, text: string, icon: string, normalRange: string) {
    this.title = title;
    this.text = text;
    this.icon = icon;
    this.normalRange = normalRange;
  }
}

export default StatisticCardObj;