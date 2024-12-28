import { useState, useEffect } from "react";

const useItemSort = (items) => {
  const [sortedItems, setSortedItems] = useState(items);
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleChangeSortKey = (newKey) => {
    setSortKey(newKey);
  };

  const handleChangeSortOrder = (newOrder) => {
    setSortOrder(newOrder);
  };

  useEffect(() => {
    const sortItems = () => {
      setSortedItems(() =>
        [...items].sort((a, b) => {
          if (sortOrder === "asc") {
            return a[sortKey] - b[sortKey];
          } else {
            return b[sortKey] - a[sortKey];
          }
        })
      );
    };
    sortItems();
  }, [items, sortKey, sortOrder]);

  return {
    sortedItems,
    sortKey,
    sortOrder,
    handleChangeSortKey,
    handleChangeSortOrder,
  };
};

export { useItemSort };
