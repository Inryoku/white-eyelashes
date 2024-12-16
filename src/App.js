import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function App() {
  return (
    <div
      className="h-screen w-full 
    bg-[url('https://plus.unsplash.com/premium_photo-1725347346926-f568729d43b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
    //  bg-cover bg-center bg-fixed patrick-hand-regular tracking-wider"
    >
      <ItemManager />
    </div>
  );
}

function ItemManager() {
  const [editingItemId, setEditingItemId] = useState(null);

  const [currentItemList, setCurrentItemList] = useState([
    {
      id: 1,
      title: "i am here",
      description: "Amazing",
      priority: 2, // 1: low, 2: middle, 3: high
      progression: 50,
      position: { x: 100, y: 100 },
      color: "",
      width: 256,
    },
  ]);

  function handleEditId(id) {
    setEditingItemId(id);
  }

  const handleAddTaskTitle = (taskTitle) => {
    const randomX = Math.random() * (window.innerWidth - 300);
    const randomY = Math.random() * (window.innerHeight - 200);
    // const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
    const newItem = {
      id: Date.now(),
      title: taskTitle,
      description: "",
      priority: 2,
      progression: 0,
      position: { x: randomX, y: randomY },
      // color: randomColor,
      width: 256,
    };
    console.log("New Item:", newItem);
    handleAddItem(newItem);
  };

  const handleModifyItem = (id, key, value) => {
    setCurrentItemList((currentItemList) =>
      currentItemList.map((oneItem) =>
        oneItem.id === id ? { ...oneItem, [key]: value } : oneItem
      )
    );
  };

  const handleEditItem = (id, editedData) => {
    const editableKeys = ["title", "description", "priority", "progression"];
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

  const handleAddItem = (newItem) => {
    setCurrentItemList((currentItemList) => [...currentItemList, newItem]);
  };

  const handleDeleteItem = (id) => {
    setCurrentItemList((currentItemList) =>
      currentItemList.filter((f) => f.id !== id)
    );
  };

  return (
    <>
      <Board
        currentItemListList={currentItemList}
        onDelete={handleDeleteItem}
        onModifyItem={handleModifyItem}
        onEditItem={handleEditItem}
        onTurnEdit={handleEditId}
        editingItemId={editingItemId}
      />
      <ItemInput onAddItem={handleAddTaskTitle} />
    </>
  );
}

function Board({
  currentItemListList,
  onDelete,
  onModifyItem,
  onEditItem,
  onTurnEdit,
  editingItemId,
}) {
  const [isItemCardClicked, setIsItemCardClicked] = useState();
  const handleClickComponent = (componentName, e) => {
    e.stopPropagation(); // イベントの伝播を止める
    console.log(`Clicked on: ${componentName}`);
    setIsItemCardClicked(componentName === "ItemCard");
    console.log(isItemCardClicked);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        console.log("Item dropped");
      }}
      className="h-screen w-full"
      onClick={(e) => handleClickComponent("Board", e)}
    >
      <ul>
        {currentItemListList.map((singleItem) => (
          <li
            key={singleItem.id}
            onClick={(e) => handleClickComponent("ItemCard", e)}
          >
            <DraggableWrapper
              onPositionChange={onModifyItem}
              singleItemData={singleItem}
              isEditing={editingItemId === singleItem.id}
            >
              <ItemCard
                onEditItem={onEditItem}
                singleItemData={singleItem}
                onDelete={onDelete}
                onModifyItem={onModifyItem}
                isEditing={editingItemId === singleItem.id}
                onTurnEdit={onTurnEdit}
                isItemCardClicked={isItemCardClicked}
              />
            </DraggableWrapper>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItemCard({
  singleItemData,
  onDelete,
  onEditItem,
  onModifyItem,
  onTurnEdit,
  isEditing,
  isItemCardClicked,
}) {
  const handleStartEdit = (id) => {
    onTurnEdit(id);
  };

  const handleEndEdit = () => {
    onTurnEdit(null);
  };

  return isEditing ? (
    <EditForm
      singleItemData={singleItemData}
      onEndEdit={handleEndEdit}
      onEditItem={onEditItem}
      isItemCardClicked={isItemCardClicked}
    />
  ) : (
    <div
      className="todo-card p-4"
      style={{
        position: "absolute",
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        backgroundColor: singleItemData.color,
        width: `${singleItemData.width}px`,
      }}
    >
      <h3>{singleItemData.title}</h3>
      <p>{singleItemData.description}</p>
      <button
        onClick={() => onDelete(singleItemData.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
      <button
        onClick={() => handleStartEdit(singleItemData.id)}
        className="text-gray-400 hover:text-green-500 transition-colors"
      >
        <Pencil size={18} />
      </button>
      <ResizeHandle
        positionX={singleItemData.position.x}
        currentWidth={singleItemData.width}
        onWidthChange={(newWidth) =>
          onModifyItem(singleItemData.id, "width", newWidth)
        }
      />
    </div>
  );
}

function EditForm({
  singleItemData,
  onEndEdit,
  onEditItem,
  isItemCardClicked,
}) {
  const [title, setTitle] = useState(singleItemData.title);
  const [description, setDescription] = useState(singleItemData.description);
  const [priority, setPriority] = useState(singleItemData.priority);
  const [progression, setProgression] = useState(singleItemData.progression);

  const handleSaveEdit = useCallback(() => {
    const editedData = {
      title,
      description,
      priority,
      progression,
    };
    onEditItem(singleItemData.id, editedData);
    onEndEdit();
  }, [
    title,
    description,
    priority,
    progression,
    onEditItem,
    onEndEdit,
    singleItemData.id,
  ]);

  useEffect(() => {
    if (!isItemCardClicked) {
      handleSaveEdit();
    }
  }, [isItemCardClicked, handleSaveEdit]);

  const handleCancelEdit = () => {
    setTitle(null);
    setDescription(null);
    setPriority(null);
    setProgression(null);
    onEndEdit();
  };

  return (
    <div
      className="todo-card p-4"
      style={{
        position: "absolute",
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        backgroundColor: singleItemData.color,
        width: `${singleItemData.width}px`,
      }}
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={() => handleSaveEdit()}>
        <Check className="text-green-500 hover:text-green-300 transition-colors" />
      </button>
      <button onClick={() => handleCancelEdit()}>
        <X className="text-red-500 hover:text-red-300 transition-colors" />
      </button>
    </div>
  );
}

function ResizeHandle({ positionX, currentWidth, onWidthChange }) {
  const handleDrag = (e) => {
    const newWidth = e.clientX - positionX;
    if (newWidth >= 256 && newWidth <= 400) {
      onWidthChange(newWidth);
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`Width adjusted to: ${currentWidth}px`);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        position: "absolute",
        top: "0",
        right: "0",
        width: "12px",
        height: "100%",
        cursor: "ew-resize",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    ></div>
  );
}

function DraggableWrapper({
  children,
  onPositionChange,
  singleItemData,
  isEditing,
}) {
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    if (isEditing) return;
    const cardElement = e.target.firstChild.getBoundingClientRect();
    const targetSize = {
      width: cardElement.width,
      height: cardElement.height,
    };

    setCardSize(targetSize);

    // マウス位置とカードの左上位置との差を記録
    const offsetX = e.clientX - cardElement.left;
    const offsetY = e.clientY - cardElement.top;
    setOffset({ x: offsetX, y: offsetY });

    e.dataTransfer.setData("application/json", JSON.stringify(singleItemData));
    console.log(
      `Dragging id: ${singleItemData.id}, 
      size: width ${targetSize.width} height ${targetSize.height}, 
      Difference between the mouse position and the upper left position of the card: x ${offsetX} y ${offsetY}`
    );
  };

  const handleDragEnd = (e) => {
    if (isEditing) return;
    console.log(cardSize);

    const newPosition = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
    onPositionChange(singleItemData.id, "position", newPosition);
  };

  return (
    <div
      draggable={!isEditing}
      className={`${isEditing ? "cursor-default" : "cursor-grab"}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  );
}

function ItemInput({ onAddItem }) {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim() !== "") {
      onAddItem(taskTitle);
      setTaskTitle(""); // 入力欄をクリア
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-6 left-1/2 -translate-x-1/2"
    >
      <div className="flex gap-2">
        <input
          className="w-80 px-4 py-2 punk-input marker-font bg-white/90"
          type="text"
          placeholder="I have to do ..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <button
          className="punk-button text-white px-6 py-2 marker-font flex items-center gap-2"
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
}
