import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Pencil,
  Check,
  X,
  Plus,
  Trash2,
  Sticker,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronUp,
  Coffee,
  Flame,
} from "lucide-react";
import { useItemLogic } from "./useItemLogic";
import TextareaAutosize from "react-textarea-autosize";
import rough from "roughjs/bundled/rough.esm";
import { annotate } from "rough-notation";

export default function App() {
  return (
    <div className="h-screen w-full clipboard-bg patrick-hand-regular tracking-wider">
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
    handleChangeSortKey,
    handleChangeSortOrder,
    sortedItems,
    sortKey,
    sortOrder,
    handleDeleteAllItem,
  } = useItemLogic([
    {
      id: 1,
      title: "Welcome to Your Task Board!",
      description:
        "#1 Drag Me 🖱️\n#2 Edit Me ✏️\n#3 Delete Me 🗑️\n\n Let's get organized!",
      priority: 2, // 1: low, 2: middle, 3: high
      progress: 49,
      position: { x: 400, y: 100 },
      color: "",
      width: 290,
      sticker: "🔥",
    },
  ]);

  const [isItemCardClicked, setIsItemCardClicked] = useState();
  const handleClickComponent = (componentName, e) => {
    e.stopPropagation(); // イベントの伝播を止める
    console.log(`Clicked on: ${componentName}`);
    setIsItemCardClicked(componentName === "ItemCard");
    console.log(isItemCardClicked);
  };

  return (
    <>
      <Sidebar
        onChangeSortKey={handleChangeSortKey}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onChangeSortOrder={handleChangeSortOrder}
        sortedItems={sortedItems}
        onClickComponent={handleClickComponent}
        onDeleteAllItem={handleDeleteAllItem}
      />
      <Board
        currentItemList={currentItemList}
        onDelete={handleDeleteItem}
        onModifyItem={handleModifyItem}
        onEditItem={handleEditItem}
        onTurnEdit={handleEditId}
        editingItemId={editingItemId}
        onClickComponent={handleClickComponent}
        isItemCardClicked={isItemCardClicked}
      />
      <ItemInput onAddItem={handleAddTaskTitle} />
    </>
  );
}

function Sidebar({
  onChangeSortKey,
  onChangeSortOrder,
  sortedItems,
  sortOrder,
  sortKey,
  onClickComponent,
  onDeleteAllItem,
}) {
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const clearButtonRef = useRef(null); // ボタンの位置を取得するためのref
  // 表示・非表示を分ける用
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  // トグルで開閉アニメーションさせる用
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    if (!isSidebarExpanded) {
      // サイドバーを「開く」アニメーションを始める前にDOMへマウント
      setIsSidebarVisible(true);
      // ほんの少し遅らせてからアニメーションを開始してもOK（ただし不要ならやらなくてOK）
      setTimeout(() => {
        setIsSidebarExpanded(true);
      }, 0);
    } else {
      // サイドバーを「閉じる」アニメーションをスタート
      setIsSidebarExpanded(false);
    }
  };

  // トランジション（閉じる方）が完了したら DOM から消す
  const handleTransitionEnd = () => {
    // もし今 isSidebarExpanded が false なら、アニメーション完了後に非表示（DOMから削除）
    if (!isSidebarExpanded) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div
      className="fixed flex z-10"
      onMouseDown={(e) => onClickComponent("Sidebar", e)}
    >
      <SidebarToggleButton
        ontoggleSidebar={toggleSidebar}
        isSidebarExpanded={isSidebarExpanded}
      />

      {/* isSidebarVisible が true のときだけサイドバーのDOMをマウント */}
      {isSidebarVisible && (
        <div
          className="relative flex flex-col z-20"
          style={{
            background:
              "url('https://www.transparenttextures.com/patterns/paper.png')",
            backgroundColor: "#fefaf6",
            width: "300px",
            height: "100vh",
            border: "12px solid #000",
            transform: isSidebarExpanded
              ? "translateX(0) rotate(-3deg)"
              : "translateX(-120%) rotate(-3deg)",
            transition: "transform 0.3s ease",
            position: "relative",
            overflow: "hidden",
            boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)",
          }}
          // トランジションが終わった時に呼ばれるイベントでDOMから消す
          onTransitionEnd={handleTransitionEnd}
        >
          {/* サイドバーの中身 */}
          <SidebarHeader />

          <SidebarSortSelector
            sortKey={sortKey}
            onChangeSortKey={onChangeSortKey}
            sortOrder={sortOrder}
            onChangeSortOrder={onChangeSortOrder}
          />

          <SidebarItemList sortedItems={sortedItems} />

          <button
            ref={clearButtonRef} // ボタンの位置を取得するためのref
            className="absolute bottom-0 w-full py-3 indie-flower-regular"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderTop: "4px solid #ff758c",
            }}
            onClick={() => setIsClearModalVisible(true)}
          >
            Clear All
          </button>

          <InteractionModal
            isVisible={isClearModalVisible}
            clearButtonRef={clearButtonRef}
            onCancel={() => setIsClearModalVisible(false)}
            onConfirm={() => {
              onDeleteAllItem();
              setIsClearModalVisible(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function InteractionModal({ isVisible, clearButtonRef, onConfirm, onCancel }) {
  const modalRef = useRef(null);
  const okRef = useRef(null);
  const ngRef = useRef(null);
  const annotationRef = useRef(null); // アノテーションの参照

  // モーダルの矢印描画
  React.useEffect(() => {
    if (!isVisible) return;

    if (clearButtonRef.current && modalRef.current) {
      const buttonRect = clearButtonRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      const canvas = document.getElementById("arrow-canvas");
      const ctx = canvas.getContext("2d");

      // Rough.jsで描画
      const rc = rough.canvas(canvas);
      rc.line(
        buttonRect.x + buttonRect.width / 2, // ボタンの中央
        buttonRect.y, // ボタンの上部
        modalRect.x + modalRect.width / 2, // モーダルの中央
        modalRect.y + modalRect.height, // モーダルの下部
        {
          stroke: "white", // 線の色を白に設定
          strokeWidth: 2, // 線の太さを調整
          roughness: 3, // 手描き風の荒さ
        }
      );
    }
  }, [isVisible]);

  // ボタンのホバーイベント
  const handleMouseEnter = (targetRef, color) => {
    if (targetRef.current) {
      const annotation = annotate(targetRef.current, {
        type: "highlight", // アンダーライン
        color: color, // 線の色
        strokeWidth: 2, // 線の太さ
        padding: 5, // テキストの周りの余白
        iterations: 2, // 描画の繰り返し回数
      });
      annotation.show();
      annotationRef.current = annotation; // アノテーションを保存
    }
  };

  const handleMouseLeave = () => {
    if (annotationRef.current) {
      annotationRef.current.remove(); // アノテーションを削除
      annotationRef.current = null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      {/* 矢印を描画するCanvas */}
      <canvas
        id="arrow-canvas"
        className="absolute inset-0 pointer-events-none"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      {/* モーダル */}
      <div ref={modalRef} className="p-1 rounded-xl relative shadow-lg">
        <h2 className="text-white font-indie-flower text-3xl mb-4">
          Are you sure?
        </h2>
        <div className="flex justify-around items-center">
          <button
            ref={okRef}
            onClick={onConfirm}
            onMouseEnter={() => handleMouseEnter(okRef, "#31c418")} // ホバー時に実行
            onMouseLeave={handleMouseLeave} // ホバー解除時にリセット
            className="font-indie-flower text-lg mx-2 px-4 py-2 border rounded text-white"
          >
            Sure✨
          </button>

          <button
            ref={ngRef}
            onClick={onCancel}
            onMouseEnter={() => handleMouseEnter(ngRef, "#c41843")} // ホバー時に実行
            onMouseLeave={handleMouseLeave} // ホバー解除時にリセット
            className="font-indie-flower text-lg mx-2 px-4 py-2 border rounded text-white"
          >
            Oops,Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarHeader() {
  return (
    <div
      style={{
        background: "#ff3366",
        textTransform: "uppercase",
        transform: "rotate(-5deg)",
        width: "102%",
      }}
    >
      <h2 className="punk text-[1.75rem] text-center mt-6 mb-4 ml-2 ">
        <span>T</span>
        <span>a</span>
        <span>s</span>
        <span>k</span>
        <span>L</span>
        <span>i</span>
        <span>s</span>
        <span>t</span>
      </h2>
    </div>
  );
}

function SidebarToggleButton({ ontoggleSidebar, isSidebarExpanded }) {
  return (
    <button
      onClick={() => ontoggleSidebar()}
      className="flex justify-end absolute -left-20 top-6 z-10 p-2 w-36 bg-black text-white"
      style={{
        transform: isSidebarExpanded ? "translateX(280px)" : "translateX(0)",
        transition: "transform 0.3s ease",
        background: "linear-gradient(135deg,#d33f49, #ff3366)", // 紙の微妙な色合い
        border: "none",

        padding: "15px 25px",
        boxShadow: "5px 5px 0px rgba(0, 0, 0, 0.7)", // 太めの影で大胆に
        clipPath: "polygon(95% 0%, 100% 85%, 85% 100%, 0% 100%, 5% 15%)", // ギザギザの形
      }}
    >
      {isSidebarExpanded ? (
        <PanelLeftClose size={18} />
      ) : (
        <PanelLeftOpen size={18} />
      )}
    </button>
  );
}

function SidebarSortSelector({
  sortOrder,
  sortKey,
  onChangeSortOrder,
  onChangeSortKey,
}) {
  const SORT_ORDER_OPTIONS = {
    id: [
      { value: "asc", label: "Then → Now" },
      { value: "desc", label: "Now → Then" },
    ],
    progress: [
      { value: "asc", label: "0% → 100%" },
      { value: "desc", label: "100% → 0%" },
    ],
    priority: [
      { value: "asc", label: "Low → High" },
      { value: "desc", label: "High → Low" },
    ],
  };

  const handleSortKeyChange = (e) => {
    onChangeSortKey(e.target.value);
  };
  const handleSortOrderChange = (e) => {
    onChangeSortOrder(e.target.value);
  };

  return (
    <div
      className="p-4 w-full mt-3 ml-3 space-y-6"
      style={{
        transform: "rotate(-1deg)",
        fontFamily: "'Indie Flower', cursive",
      }}
    >
      <h2
        className="text-lg font-bold mb-2"
        style={{
          fontFamily: "'Indie Flower', cursive",
          color: "#333",
          transform: "rotate(-2deg)",
        }}
      >
        Sort Options
      </h2>

      {/* ソートキー選択 */}
      <div className="flex items-center space-x-2 mb-2">
        <label
          htmlFor="sortKey"
          style={{
            fontFamily: "'Indie Flower', cursive",
            color: "#555",
          }}
        >
          Sort By:
        </label>
        <select
          id="sortKey"
          value={sortKey}
          onChange={handleSortKeyChange}
          className="p-2 border rounded"
        >
          <option value="id">Added Time</option>
          <option value="progress">Progress</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {/* ソート順序選択 */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="sortOrder"
          style={{
            fontFamily: "'Indie Flower', cursive",
            color: "#555",
          }}
        >
          Order:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="p-2 border rounded"
        >
          {SORT_ORDER_OPTIONS[sortKey].map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SidebarItemList({ sortedItems }) {
  return (
    <ul className="space-y-6 p-6 overflow-y-auto mb-10">
      {sortedItems.map((singleItem) => (
        <li key={singleItem.id}>
          <SidebarItemCard singleItemData={singleItem} />
        </li>
      ))}
    </ul>
  );
}

function SidebarItemCard({ singleItemData }) {
  return (
    <div
      className="p-4 notebookWhite-bg shadow-xl flex flex-col gap-2 patrick-hand-regular"
      style={{
        transform: "rotate(-2deg)",
      }}
    >
      <h3>{singleItemData.title}</h3>
      <PriorityTag priority={singleItemData.priority} />
      <ProgressBar progress={singleItemData.progress} />
    </div>
  );
}

function Board({
  currentItemList,
  onDelete,
  onModifyItem,
  onEditItem,
  onTurnEdit,
  editingItemId,
  onClickComponent,
  isItemCardClicked,
}) {
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
      onMouseDown={(e) => onClickComponent("Board", e)}
    >
      <ul>
        {currentItemList.map((singleItem) => (
          <li
            key={singleItem.id}
            onMouseDown={(e) => onClickComponent("ItemCard", e)}
          >
            <DraggableWrapper
              onPositionChange={onModifyItem}
              singleItemData={singleItem}
              isEditing={editingItemId === singleItem.id}
              isItemCardClicked={isItemCardClicked}
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

function DraggableWrapper({
  children,
  onPositionChange,
  singleItemData,
  isEditing,
  isItemCardClicked,
}) {
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    try {
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

      e.dataTransfer.setData(
        "application/json",
        JSON.stringify(singleItemData)
      );
      console.log(
        `Dragging id: ${singleItemData.id}, 
      size: width ${targetSize.width} height ${targetSize.height}, 
      Difference between the mouse position and the upper left position of the card: x ${offsetX} y ${offsetY}`
      );
    } catch {}
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
  const [isStickerPickerVisible, setIsStickerPickerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const cardRef = useRef(null); // カードの高さを取得するためのref
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.getBoundingClientRect().height);
      setIsDescriptionLong(cardHeight > 290);
    }
  }, [cardHeight]);

  const handleToggleStickerPicker = () => {
    setIsStickerPickerVisible(() => !isStickerPickerVisible);
  };

  const handleDeleteItem = () => {
    onDelete(singleItemData.id);
  };

  const handleToggleDescriptionTab = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <div
      ref={cardRef}
      className="absolute todo-card p-4 flex flex-col gap-2"
      style={{
        left: singleItemData.position.x,
        top: singleItemData.position.y,
        width: `${singleItemData.width}px`,
      }}
    >
      <div className="absolute -top-3 -right-3 text-3xl transform rotate-12  transition-transform">
        {singleItemData.sticker}
      </div>

      <h3>{singleItemData.title}</h3>

      {isStickerPickerVisible ? (
        <StickerPicker
          onAddSticker={(sticker) =>
            onModifyItem(singleItemData.id, "sticker", sticker)
          }
          onSwitchStickerPicker={handleToggleStickerPicker}
        />
      ) : null}

      <PriorityTag priority={singleItemData.priority} />

      {singleItemData.progress !== 0 ? (
        <ProgressBar progress={singleItemData.progress} isEditing={isEditing} />
      ) : null}

      <TaskDescription
        description={singleItemData.description}
        isDescriptionLong={isDescriptionLong}
        isDescriptionOpen={isDescriptionOpen}
      />

      <div className="flex gap-2 justify-end mr-4">
        <DescriptionToggleButton
          isDescriptionLong={isDescriptionLong}
          isDescriptionOpen={isDescriptionOpen}
          onToggleDescriptionTab={handleToggleDescriptionTab}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={18} />
        </button>

        <button
          className="text-gray-400 hover:text-amber-500 transition-colors"
          onClick={() => handleToggleStickerPicker()}
        >
          <Sticker size={18} />
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
      <DeleteModal
        isOpen={isModalOpen}
        onConfirm={() => handleDeleteItem()}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

function PriorityTag({ priority, isEditing, onChangePriority }) {
  const PRIORITY_HIGH = 3;
  const PRIORITY_MIDDLE = 2;
  const PRIORITY_LOW = 1;

  const PRIORITY_MAP = {
    3: {
      icon: <Flame size={18} />,
      label: "High",
      color: "text-red-500",
    },
    1: {
      icon: <Coffee size={18} />,
      label: "Low",
      color: "text-sky-500",
    },
    default: { icon: null, label: null, color: "text-gray-500" },
  };
  const priorityData = PRIORITY_MAP[priority] || PRIORITY_MAP.default;

  const handleChange = (e) => {
    if (onChangePriority) {
      onChangePriority(Number(e.target.value));
    }
  };

  return isEditing ? (
    <select
      id="sortKey"
      value={priority}
      onChange={handleChange}
      className="p-1 punk-input border rounded w-32"
    >
      <option value={PRIORITY_HIGH}>⇧High</option>
      <option value={PRIORITY_MIDDLE}>---</option>
      <option value={PRIORITY_LOW}>⇩Low</option>
    </select>
  ) : (
    <div className={`flex items-center gap-2 ${priorityData.color}`}>
      {priorityData.icon}
      <span>{priorityData.label}</span>
    </div>
  );
}

function TaskDescription({
  description,
  isDescriptionLong,
  isDescriptionOpen,
}) {
  return (
    <>
      <p
        className={`text-sm text-gray-600 whitespace-pre-wrap overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isDescriptionLong
            ? isDescriptionOpen
              ? "max-h-[450px]"
              : "max-h-32"
            : "h-auto"
        }`}
      >
        {description}
      </p>
      {!isDescriptionOpen && isDescriptionLong ? (
        <div className="absolute bottom-10 left-0 w-full h-10 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none">
          <div className="absolute bottom-0 w-full h-full blur-md"></div>
        </div>
      ) : null}
    </>
  );
}

function DescriptionToggleButton({
  isDescriptionLong,
  isDescriptionOpen,
  onToggleDescriptionTab,
}) {
  return (
    <>
      {isDescriptionLong ? (
        <button
          onClick={() => onToggleDescriptionTab()}
          className="mr-auto text-gray-400 hover:text-violet-400 transition-colors"
        >
          {isDescriptionOpen ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      ) : null}
    </>
  );
}

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(4px)", // 背景をぼかす
      }}
    >
      <div
        className="p-6 w-[300px] "
        style={{
          transform: "rotate(-2deg)",
        }}
      >
        <h3
          className="text-xl font-bold mb-4 "
          style={{
            backgroundColor: "#fefaf6", // 紙っぽい色
            border: "4px dashed black", // 手書き風の破線
            boxShadow: "4px 4px 0 rgba(0, 0, 0, 0.5)", // シャドウ
            transform: "rotate(-2deg)", // 少し傾ける
          }}
        >
          ★ Are you sure?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Oops, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Sure
          </button>
        </div>
      </div>
    </div>
  );
}

function StickerPicker({ onAddSticker, onSwitchStickerPicker }) {
  const stickerList = ["🎸", "⚡️", "💀", "🔥", "💔", "🎧", "🎵", "🎼", "📷"];

  const handleSubmitSticker = (sticker) => {
    onAddSticker(sticker);
    onSwitchStickerPicker();
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {stickerList.map((sticker) => (
        <button
          key={sticker}
          onClick={() => handleSubmitSticker(sticker)}
          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
        >
          {sticker}
        </button>
      ))}
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

  const handleChangePriority = (newPriority) => {
    setPriority(newPriority);
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
      <TextareaAutosize
        className="w-full px-2 py-1 punk-input text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title..."
        minRows={1} // 最小行数を1に設定（シングルラインに見せる）
        maxRows={5} // 最大行数（必要に応じて調整可能）
        autoFocus
      />

      <PriorityTag
        priority={priority}
        isEditing={isEditing}
        onChangePriority={handleChangePriority}
      />
      <ProgressBar
        progress={progress}
        isEditing={isEditing}
        onChangeProgress={handleChangeProgress}
      />

      <TextareaAutosize
        className="w-full px-2 py-1 punk-input min-h-[100px] max-h-[500px] resize-y text-sm"
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
        <div className="mr-3 h-2 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
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
