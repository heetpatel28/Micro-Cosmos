package com.example.crud.service;

import com.example.crud.model.Item;
import com.example.crud.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAll() {
        return itemRepository.findAll();
    }

    public Optional<Item> getById(Long id) {
        return itemRepository.findById(id);
    }

    public Item create(Item item) {
        return itemRepository.save(item);
    }

    public Optional<Item> update(Long id, Item itemDetails) {
        return itemRepository.findById(id).map(item -> {
            item.setName(itemDetails.getName());
            item.setDescription(itemDetails.getDescription());
            item.setPrice(itemDetails.getPrice());
            return itemRepository.save(item);
        });
    }

    public boolean delete(Long id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

