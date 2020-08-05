const Rates = require('./rate.model');

class RatesService {
  getRateById(id) {
    return Rates.findById(id);
  }

  getAllRatesByProduct(id) {
    return Rates.find({ product: id });
  }

  updateRate(id, Rates) {
    return Rates.findByIdAndUpdate(id, rates, { new: true });
  }

  addRate(data) {
    const rates = new Rates(data);
    return rates.save();
  }

  deleteRate(id) {
    return Rates.findByIdAndDelete(id);
  }
}
module.exports = new RatesService();
