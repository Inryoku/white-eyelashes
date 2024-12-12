import React, { useState } from "react";

export default function App() {
  const [currentCards, setCurrentCards] = useState([]);

  const handleAddCards = (newCard) => {
    setCurrentCards((currentCards) => [...currentCards, newCard]);
  };
  return (
    <div
      className="h-screen w-full 
    bg-[url('https://plus.unsplash.com/premium_photo-1725347346926-f568729d43b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]
    //  bg-cover bg-center bg-fixed"
    >
      <Board currentCards={currentCards} />
      <AddCardForm onAddCards={handleAddCards} />
    </div>
  );
}

function Board({ currentCards }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
  };

  return (
    <div
      className="h-screen w-full"
      // to be recognized as a drop area
      onDragOver={(e) => e.preventDefault()}
      // Prevent default behavior on drop
      onDrop={(e) => e.preventDefault()}
    >
      <ul>
        {currentCards.map((m) => (
          <DraggableCard
            position={position}
            onPositionChange={handlePositionChange}
          />
        ))}
      </ul>
    </div>
  );
}

function DraggableCard({ position, onPositionChange }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const handleDragStart = (e) => {
    if (e.type === "touchstart") {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
      setDragging(true);
    } else {
      // Set element size
      const cardElement = e.target.getBoundingClientRect();
      setCardSize({
        width: cardElement.width,
        height: cardElement.height,
      });
      e.dataTransfer.setData("text/plain", "card");
    }
  };

  const handleDragEnd = (e) => {
    const { clientX, clientY } = e;

    // adjust the center of the card with the cursor position
    onPositionChange({
      x: clientX - cardSize.width / 2,
      y: clientY - cardSize.height / 2,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - offset.x;
    const newY = touch.clientY - offset.y;
    onPositionChange({ x: newX, y: newY });
  };

  function handleTouchEnd() {
    setDragging(false);
  }

  return (
    <div
      className={`todo-card absolute w-24 h-12 flex items-center justify-center`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        cursor: "grab",
      }}
    >
      ドラッグ可能なカード
    </div>
  );
}

function AddCardForm({ onAddCards }) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;
    const newCard = { description, id: Date.now() };

    console.log(newCard);
    onAddCards(newCard);

    setDescription("");
  };

  return (
    <form className="punk-input" onSubmit={handleSubmit}>
      <DescriptionInput
        description={description}
        setDescription={setDescription}
      />
      <button>Add</button>
    </form>
  );
}

function DescriptionInput({ description, setDescription }) {
  return (
    <input
      type="text"
      placeholder="Item..."
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  );
}
