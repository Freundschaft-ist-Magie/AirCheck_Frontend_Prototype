class Dataset {
  label: string;
  data: number[];
  fill: boolean;
  borderColor: string;
  tension: number;

  constructor(label: string, data: number[], fill: boolean, borderColor: string, tension: number) {
    this.label = label;
    this.data = data;
    this.fill = fill;
    this.borderColor = borderColor;
    this.tension = tension;
  }
}

export default Dataset;