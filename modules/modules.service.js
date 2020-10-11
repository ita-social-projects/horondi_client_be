class ModulesService {
  constructor(ItemModule) {
    this.ItemModule = ItemModule;
  }

  async deleteItem(id, ERROR_MESSAGE) {
    const res = await this.ItemModule.findByIdAndDelete(id);
    return res || new Error(ERROR_MESSAGE);
  }

  addItem() {}

  updateItemById() {}

  getItems() {}

  updateItems() {}
}

module.exports = new ModulesService();
