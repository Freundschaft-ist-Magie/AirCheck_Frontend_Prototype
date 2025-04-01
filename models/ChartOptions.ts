class ChartOptions {
  scales: {
    y: {
      beginAtZero: boolean;
    };
  }

  constructor() {
    this.scales = {
      y: {
        beginAtZero: true,
      },
    };
  }
}

export default ChartOptions;