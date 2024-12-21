function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed flex z-10">
      <button
        onClick={toggleSidebar}
        className="absolute top-6 left-2 z-20 p-2 bg-black text-white rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{
          transform: isOpen ? "translateX(280px)" : "translateX(0)", // ボタンの位置もサイドバーに合わせる
          transition: "transform 0.3s ease",
        }}
      >
        {isOpen ? "❌" : "➕"} {/* アイコン変更 */}
      </button>
      <div
        className="relative flex flex-col justify-between translateX(280px) "
        style={{
          background:
            "url('https://www.transparenttextures.com/patterns/paper.png')", // 背景に紙質テクスチャ
          backgroundColor: "#fefaf6", // 暖かい紙色
          width: "300px",
          height: "100vh",
          border: "12px solid #000", // 太い黒枠でDIY感
          transform: `${
            isOpen ? "translateX(0)" : "translateX(-120%)"
          } rotate(-3deg)`, // 全体を少し斜めに
          transition: "transform 0.3s ease",
          position: "relative",
          overflow: "hidden",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.5)", // 強い影
        }}
      >
        {/* スプレーペイントのアクセント */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40"
          style={{
            background:
              "radial-gradient(circle, rgba(255,117,140,0.5) 0%, rgba(255,255,255,0) 80%)",
            filter: "blur(10px)",
            transform: "rotate(30deg)",
          }}
        ></div>

        {/* タイトル */}
        <h1
          className="text-4xl text-white p-4"
          style={{
            background: "linear-gradient(45deg, #d33f49, #ff758c)",
            color: "#fff",
            fontFamily: "'Permanent Marker', cursive",
            textTransform: "uppercase",
            transform: "rotate(-5deg)",
            textShadow: "2px 2px 0px #000",
            marginBottom: "20px",
          }}
        >
          Sideboard
        </h1>

        {/* メニューアイテム */}
        <ul className="space-y-6 p-6">
          <li
            className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
            style={{
              borderRadius: "12px",
              transform: "rotate(-2deg)",
              boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Indie Flower', cursive",
            }}
          >
            <span className="text-xl text-gray-700">🎨 Art Board</span>
            {/* スプレーアイコン */}
            <span
              className="absolute -top-2 -left-3 w-6 h-6 bg-pink-400 rounded-full"
              style={{
                filter: "blur(6px)",
                opacity: 0.5,
              }}
            ></span>
          </li>
          <li
            className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
            style={{
              borderRadius: "12px",
              transform: "rotate(2deg)",
              boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Indie Flower', cursive",
            }}
          >
            <span className="text-xl text-gray-700">📓 Personal Diary</span>
            <span
              className="absolute -top-2 -right-3 w-6 h-6 bg-blue-400 rounded-full"
              style={{
                filter: "blur(6px)",
                opacity: 0.5,
              }}
            ></span>
          </li>
          <li
            className="relative group p-3 bg-white shadow-lg flex items-center justify-between cursor-pointer"
            style={{
              borderRadius: "12px",
              transform: "rotate(-1deg)",
              boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3)",
              fontFamily: "'Indie Flower', cursive",
            }}
          >
            <span className="text-xl text-gray-700">🎵 Music Collection</span>
            <span
              className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full"
              style={{
                filter: "blur(6px)",
                opacity: 0.5,
              }}
            ></span>
          </li>
        </ul>

        {/* フッターボタン */}
        <button
          className="w-full py-3"
          style={{
            backgroundColor: "#000",
            color: "#fff",
            fontFamily: "'Permanent Marker', cursive",
            textTransform: "uppercase",
            letterSpacing: "1px",
            borderTop: "4px solid #ff758c",
            cursor: "pointer",
          }}
        >
          Add New
        </button>
      </div>
    </div>
  );
}
