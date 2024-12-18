import { useEffect, useState } from "react";

export function useItemLogic(initialItems) {
  const [editingItemId, setEditingItemId] = useState(null);
  // const [currentItemList, setCurrentItemList] = useState(initialItems);

  const [currentItemList, setCurrentItemList] = useState(() => {
    const savedData = localStorage.getItem("currentItemList");
    return savedData ? JSON.parse(savedData) : initialItems;
  });

  useEffect(() => {
    localStorage.setItem("currentItemList", JSON.stringify(currentItemList));
  }, [currentItemList]);

  const handleAddItem = (newItem) => {
    setCurrentItemList((currentItemList) => [...currentItemList, newItem]);
  };

  const handleDeleteItem = (id) => {
    setCurrentItemList((currentItemList) =>
      currentItemList.filter((f) => f.id !== id)
    );
  };

  const handleAddTaskTitle = (taskTitle) => {
    const randomX = Math.random() * (window.innerWidth - 300);
    const randomY = Math.random() * (window.innerHeight - 200);
    const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
    const newItem = {
      id: Date.now(),
      title: taskTitle,
      description: "",
      priority: 2,
      progress: 0,
      position: { x: randomX, y: randomY },
      color: randomColor,
      width: 256,
    };
    console.log("New Item:", newItem);
    handleAddItem(newItem);
  };

  const handleEditId = (id) => {
    setEditingItemId(id);
  };

  const handleEditItem = (id, editedData) => {
    const editableKeys = ["title", "description", "priority", "progress"];
    setCurrentItemList((currentItemList) =>
      currentItemList.map((oneItem) =>
        oneItem.id === id
          ? {
              ...oneItem,
              ...Object.fromEntries(
                editableKeys.map((key) => [
                  key,
                  editedData[key] ?? oneItem[key],
                ])
              ),
            }
          : oneItem
      )
    );
  };

  const handleModifyItem = (id, key, value) => {
    setCurrentItemList((currentItemList) =>
      currentItemList.map((oneItem) =>
        oneItem.id === id ? { ...oneItem, [key]: value } : oneItem
      )
    );
  };

  return {
    handleEditId,
    handleAddTaskTitle,
    handleModifyItem,
    handleEditItem,
    handleDeleteItem,
    currentItemList,
    editingItemId,
  };
}
