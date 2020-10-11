class ModulesService {
  constructor() {}

  async deleteItem(id, ItemClass, ERROR_MESSAGE) {
    const res = await ItemClass.findByIdAndDelete(id);
    return res || new Error(ERROR_MESSAGE);
  }

  addItem() {}

  updateItemById() {}

  getItems() {}

  updateItems() {}
}

module.exports = new ModulesService();
