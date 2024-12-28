import { useItemEdit } from "./useItemEdit";
import { useItemSort } from "./useItemSort";

const useItemLogic = (initialItems) => {
  const {
    currentItemList,
    editingItemId,
    handleAddItem,
    handleDeleteItem,
    handleDeleteAllItem,
    handleAddTaskTitle,
    handleEditId,
    handleEditItem,
    handleModifyItem,
  } = useItemEdit(initialItems);

  const {
    sortedItems,
    sortKey,
    sortOrder,
    handleChangeSortKey,
    handleChangeSortOrder,
  } = useItemSort(currentItemList);

  return {
    currentItemList,
    editingItemId,
    handleAddItem,
    handleDeleteItem,
    handleDeleteAllItem,
    handleAddTaskTitle,
    handleEditId,
    handleEditItem,
    handleModifyItem,
    sortedItems,
    sortKey,
    sortOrder,
    handleChangeSortKey,
    handleChangeSortOrder,
  };
};

export { useItemLogic };
