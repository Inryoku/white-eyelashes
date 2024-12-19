import React, { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { useItemLogic } from "./useItemLogic";
import TextareaAutosize from "react-textarea-autosize";

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
  const {
    handleEditId,
    handleAddTaskTitle,
    handleModifyItem,
    handleEditItem,
    handleDeleteItem,
    currentItemList,
    editingItemId,
  } = useItemLogic([
    {
      id: 1,
      title: "Welcome to Your Task Board!",
      description:
        "#1 Drag Me 🖱️\n#2 Edit Me ✏️\n#3 Delete Me 🗑️\n\n Let's get organized!",
      priority: 2, // 1: low, 2: middle, 3: high
      progress: 49,
      position: { x: 100, y: 100 },
      color: "",
      width: 290,
    },
  ]);

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

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="relative flex">
//       <button
//         onClick={toggleSidebar}
//         className="absolute top-6 left-2 z-20 p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
//         style={{
//           transform: isOpen ? "translateX(280px)" : "translateX(0)", // ボタンの位置もサイドバーに合わせる
//         }}
//       >
//         {isOpen ? "❌" : "➕"} {/* アイコン変更 */}
//       </button>
//       <div
//         className="relative flex flex-col justify-between"
//         style={{
//           background:
//             "url('https://www.transparenttextures.com/patterns/paper.png')", // 背景に紙質テクスチャ
//           backgroundColor: "#fefaf6", // 暖かい紙色
//           width: "300px",
//           height: "100vh",
//           border: "12px solid #000", // 太い黒枠でDIY感
//           transform: "rotate(-3deg)", // 全体を少し斜めに
//           position: "relative",
//           overflow: "hidden",
//           boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)", // 強い影
//         }}
//       >
//         {/* スプレーペイントのアクセント */}
//         <div
//           className="absolute -top-10 -right-10 w-40 h-40"
//           style={{
//             background:
//               "radial-gradient(circle, rgba(255,117,140,0.5) 0%, rgba(255,255,255,0) 80%)",
//             filter: "blur(10px)",
//             transform: "rotate(30deg)",
//           }}
//         ></div>

//         {/* タイトル */}
//         <h1
//           className="text-4xl text-white p-4"
//           style={{
//             background: "linear-gradient(45deg, #d33f49, #ff758c)",
//             color: "#fff",
//             fontFamily: "'Permanent Marker', cursive",
//             textTransform: "uppercase",
//             transform: "rotate(-5deg)",
//             textShadow: "2px 2px 0px #000",
//             marginBottom: "20px",
//           }}
//         >
//           Sideboard
//         </h1>

//         {/* メニューアイテム */}
//         <ul className="space-y-6 p-6">
//           <li
//             className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
//             style={{
//               borderRadius: "12px",
//               transform: "rotate(-2deg)",
//               boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
//               fontFamily: "'Indie Flower', cursive",
//             }}
//           >
//             <span className="text-xl text-gray-700">🎨 Art Board</span>
//             {/* スプレーアイコン */}
//             <span
//               className="absolute -top-2 -left-3 w-6 h-6 bg-pink-400 rounded-full"
//               style={{
//                 filter: "blur(6px)",
//                 opacity: 0.5,
//               }}
//             ></span>
//           </li>
//           <li
//             className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
//             style={{
//               borderRadius: "12px",
//               transform: "rotate(2deg)",
//               boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
//               fontFamily: "'Indie Flower', cursive",
//             }}
//           >
//             <span className="text-xl text-gray-700">📓 Personal Diary</span>
//             <span
//               className="absolute -top-2 -right-3 w-6 h-6 bg-blue-400 rounded-full"
//               style={{
//                 filter: "blur(6px)",
//                 opacity: 0.5,
//               }}
//             ></span>
//           </li>
//           <li
//             className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
//             style={{
//               borderRadius: "12px",
//               transform: "rotate(-1deg)",
//               boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
//               fontFamily: "'Indie Flower', cursive",
//             }}
//           >
//             <span className="text-xl text-gray-700">🎵 Music Collection</span>
//             <span
//               className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full"
//               style={{
//                 filter: "blur(6px)",
//                 opacity: 0.5,
//               }}
//             ></span>
//           </li>
//         </ul>

//         {/* フッターボタン */}
//         <button
//           className="w-full py-3"
//           style={{
//             backgroundColor: "#000",
//             color: "#fff",
//             fontFamily: "'Permanent Marker', cursive",
//             textTransform: "uppercase",
//             letterSpacing: "1px",
//             borderTop: "4px solid #ff758c",
//             cursor: "pointer",
//           }}
//         >
//           Add New
//         </button>
//       </div>
//     </div>
//   );
// }

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
      className="h-screen w-full flex"
      onMouseDown={(e) => handleClickComponent("Board", e)}
    >
      <ul>
        {currentItemListList.map((singleItem) => (
          <li
            key={singleItem.id}
            onMouseDown={(e) => handleClickComponent("ItemCard", e)}
          >
            <DraggableWrapper
              onPositionChange={onModifyItem}
              singleItemData={singleItem}
              isEditing={editingItemId === singleItem.id}
            >
              <TwoFacesItemCard
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

function TwoFacesItemCard({
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
      isEditing={isEditing}
    />
  ) : (
    <DisplayCard
      singleItemData={singleItemData}
      onDelete={onDelete}
      isEditing={isEditing}
      handleStartEdit={handleStartEdit}
      onModifyItem={onModifyItem}
    />
  );
}

function DisplayCard({
  singleItemData,
  onDelete,
  isEditing,
  handleStartEdit,
  onModifyItem,
}) {
  return (
    <div
      className="todo-card p-4 flex flex-col gap-2"
      style={{
        position: "absolute",
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        width: `${singleItemData.width}px`,
      }}
    >
      <h3>{singleItemData.title}</h3>
      <ProgressBar progress={singleItemData.progress} isEditing={isEditing} />
      <p className="text-sm text-gray-600 whitespace-pre-wrap">
        {singleItemData.description}
      </p>
      <div className="flex gap-2 justify-end mr-4">
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
      </div>
      <ResizeHandle
        positionX={singleItemData.position.x}
        currentWidth={singleItemData.width}
        itemColor={singleItemData.color}
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
  isEditing,
}) {
  const [title, setTitle] = useState(singleItemData.title);
  const [description, setDescription] = useState(singleItemData.description);
  const [priority, setPriority] = useState(singleItemData.priority);
  const [progress, setProgress] = useState(singleItemData.progress);

  const handleSaveEdit = useCallback(() => {
    const editedData = {
      title,
      description,
      priority,
      progress,
    };
    onEditItem(singleItemData.id, editedData);
    onEndEdit();
  }, [
    title,
    description,
    priority,
    progress,
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
    onEndEdit();
  };

  const handleChangeProgress = (newProgress) => {
    setProgress(newProgress);
  };

  return (
    <div
      className="todo-card p-4 flex flex-col gap-3"
      style={{
        position: "absolute",
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        width: `${singleItemData.width}px`,
      }}
    >
      <input
        className="flex-1 px-2 py-1 punk-input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <ProgressBar
        progress={progress}
        isEditing={isEditing}
        onChangeProgress={handleChangeProgress} // 更新関数を渡す
      />
      <TextareaAutosize
        className="w-full px-2 py-1 punk-input min-h-[80px] resize-y"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description..."
      />
      <div className="flex gap-2 justify-end mr-4">
        <button onClick={() => handleCancelEdit()}>
          <X className="text-red-500 hover:text-red-300 transition-colors" />
        </button>
        <button onClick={() => handleSaveEdit()}>
          <Check className="text-green-500 hover:text-green-300 transition-colors" />
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ progress, isEditing, onChangeProgress }) {
  // Rangeスライダーの値を更新
  const handleChange = (e) => {
    if (onChangeProgress) {
      onChangeProgress(Number(e.target.value));
    }
  };

  // プログレスバーの色を取得
  const getProgressColor = (value) => {
    if (value < 30) return "#f87171"; // 赤 (Tailwind: bg-red-500)
    if (value < 50) return "#fb923c"; // オレンジ (Tailwind: bg-orange-400)
    if (value < 70) return "#a78bfa"; // 紫 (Tailwind: bg-purple-500)
    if (value < 90) return "#60a5fa"; // 青 (Tailwind: bg-blue-400)
    return "#34d399"; // 緑 (Tailwind: bg-green-500)
  };

  return (
    <div className="w-full">
      {isEditing ? (
        <div className="relative w-full flex items-center gap-2">
          {/* Inputスライダー */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleChange}
            className="w-full h-2 appearance-none rounded-lg"
            style={{
              background: `linear-gradient(to right, ${getProgressColor(
                progress
              )} ${progress}%, #e5e7eb ${progress}%)`,
            }}
          />
          {/* 進捗値 */}
          <span className="text-sm w-12 text-gray-700">{progress}%</span>
        </div>
      ) : (
        <div className="w-full h-2 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: getProgressColor(progress),
            }}
          />
        </div>
      )}
    </div>
  );
}

function ResizeHandle({ positionX, currentWidth, onWidthChange, itemColor }) {
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
        backgroundColor: "rgba(0, 0, 0, 0.1)", //迷う`{itemColor}`,
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
      onDragOver={(e) => {
        e.preventDefault(); // Firefox対応
        e.dataTransfer.dropEffect = "move";
      }}
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
          <Plus size={20} />
          Add
        </button>
      </div>
    </form>
  );
}
