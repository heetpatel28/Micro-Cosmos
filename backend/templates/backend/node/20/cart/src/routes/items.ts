import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ItemService } from '../services/itemService.js';

export const itemRouter = Router();
const itemService = new ItemService();

// Validation schemas
const createItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive().optional(),
});

const updateItemSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
});

/**
 * GET /api/items
 * Get all items
 */
itemRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const items = await itemService.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

/**
 * GET /api/items/:id
 * Get item by ID
 */
itemRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await itemService.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

/**
 * POST /api/items
 * Create a new item
 */
itemRouter.post('/', async (req: Request, res: Response) => {
  try {
    const validated = createItemSchema.parse(req.body);
    const item = await itemService.create(validated);
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create item' });
  }
});

/**
 * PUT /api/items/:id
 * Update an item
 */
itemRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const validated = updateItemSchema.parse(req.body);
    const item = await itemService.update(req.params.id, validated);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update item' });
  }
});

/**
 * DELETE /api/items/:id
 * Delete an item
 */
itemRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await itemService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

