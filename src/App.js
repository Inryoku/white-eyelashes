import React, { useState } from "react";

export default function App() {
  return (
    <div
      className="h-screen w-full 
    bg-[url('https://plus.unsplash.com/premium_photo-1725347346926-f568729d43b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
    //  bg-cover bg-center bg-fixed"
    >
      <ItemManager />
    </div>
  );
}

function ItemManager() {
  const [currentItem, setCurrentItem] = useState([
    {
      id: 1,
      title: "i am here",
      description: "Amazing",
      position: { x: 400, y: 100 },
      color: "",
    },
  ]);

  const handleAddItem = (newItem) => {
    setCurrentItem((currentItem) => [...currentItem, newItem]);
  };

  return (
    <>
      <Board currentItemList={currentItem} />
      <ItemInput onAddItem={handleAddItem} />
    </>
  );
}

function Board({ currentItemList }) {
  return (
    <div>
      <ul>
        {currentItemList.map((singleItem) => (
          <li>
            <ItemCard singleItemData={singleItem} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ItemCard({ singleItemData }) {
  return (
    <div
      className="todo-card p-4 w-64"
      style={{
        position: "absolute",
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        backgroundColor: singleItemData.color,
      }}
    >
      <div>{singleItemData.title}</div>
      <div>{singleItemData.description}</div>
    </div>
  );
}

function ItemInput({ onAddItem }) {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim() !== "") {
      const randomX = Math.random() * (window.innerWidth - 300);
      const randomY = Math.random() * (window.innerHeight - 200);
      const randomColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
      onAddItem({
        id: Date.now(),
        title: taskTitle,
        description: "",
        position: { x: randomX, y: randomY },
        // color: randomColor,
      });
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
