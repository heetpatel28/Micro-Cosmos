import { Item, IItem } from '../models/Item.js';

export class ItemService {
  async getAll(): Promise<IItem[]> {
    return Item.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<IItem | null> {
    return Item.findById(id);
  }

  async create(data: Partial<IItem>): Promise<IItem> {
    const item = new Item(data);
    return item.save();
  }

  async update(id: string, data: Partial<IItem>): Promise<IItem | null> {
    return Item.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Item.findByIdAndDelete(id);
    return !!result;
  }
}

