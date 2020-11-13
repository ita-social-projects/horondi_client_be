class NovaPoshtaService {
  getNovaPoshtaCities() {
    return [
      {
        ref: 1,
      },
    ];
  }
  getNovaPoshtaPrices() {
    return [
      {
        cost: 10,
      },
    ];
  }
}

module.exports = new NovaPoshtaService();
