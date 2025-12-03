import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import useAuth from "../../hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configure axios instance with credentials for cookie-based auth
const chatAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobile, setMobile] = useState(window.innerWidth < 768);

  const chatWindowRef = useRef();
  const inputRef = useRef();

// DYNAMIC HEIGHT FIX FOR REAL MOBILE DEVICES
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.visualViewport?.height || window.innerHeight}px`
      );
    };
    setAppHeight();
    window.visualViewport?.addEventListener("resize", setAppHeight);
    return () => window.visualViewport?.removeEventListener("resize", setAppHeight);
  }, []);

  useEffect(() => {
    if (mobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [mobile, sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  async function fetchChats() {
    try {
      const res = await chatAPI.get('/chat/');
      setChats(res.data?.data?.chats || []);
      if (res.data?.data?.chats.length > 0) {
        fetchChatById(res.data.data.chats[0].chatId);
      } else {
        setActiveChat(null);
      }
    } catch {
      setChats([]);
      setActiveChat(null);
    }
  }

  async function fetchChatById(chatId) {
    try {
      const res = await chatAPI.get(`/chat/${chatId}`);
      if (res.data?.data?.chat) setActiveChat(res.data.data.chat);
    } catch {
      setActiveChat(null);
    }
  }

  function startNewChat() {
    setActiveChat(null);
    setMessageInput("");
    closeSidebarOnMobile();
  }

  async function sendMessage(e) {
    e?.preventDefault();

    if (!user) {
      setToast({
        show: true,
        message: "Please login first to send a message.",
        type: "error",
      });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
      return;
    }

    if (!messageInput.trim()) return;
    setLoading(true);
    try {
      let chat = activeChat;
      if (!chat) {
        const res = await chatAPI.post(
          '/chat/new',
          { message: messageInput }
        );
        chat = res.data.data.chat;
        setChats([chat, ...chats]);
      } else {
        const res = await chatAPI.post(
          `/chat/${chat.chatId}/message`,
          { message: messageInput }
        );
        chat = res.data.data.chat;
        setChats(chats.map((c) => (c.chatId === chat.chatId ? chat : c)));
      }
      setActiveChat(chat);
      setMessageInput("");
      scrollToBottom();
    } catch {
      setToast({ show: true, message: "Message send failed!", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectChat(chatId) {
    fetchChatById(chatId);
    closeSidebarOnMobile();
  }

  async function handleSearch(val) {
    setSearchQuery(val);
    if (!val.trim()) return fetchChats();
    try {
      const res = await chatAPI.get('/chat/search', {
        params: { query: val.trim() },
      });
      setChats(res.data?.data?.chats || []);
    } catch {
      setToast({ show: true, message: "Search failed!", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  }

  function closeSidebarOnMobile() {
    if (mobile) setSidebarOpen(false);
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatWindowRef.current)
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }, 50);
  }

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = "44px";
    textarea.style.overflowY = "hidden";
    const maxHeight = 44 * 6;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = maxHeight + "px";
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [messageInput]);

  useEffect(() => {
    scrollToBottom();
  }, [activeChat]);

  return (
    <>
      {/* Toast container above Header with high z-index */}
      <div className="relative z-[9999]">
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      </div>
      <Header />
      <main 
        className="fixed w-screen top-0 left-0 bg-black overflow-hidden z-0 flex flex-col"
        style={{
          height: 'var(--app-height)',
          paddingTop: 'max(96px, calc(96px + env(safe-area-inset-top)))',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="flex flex-1 w-full max-w-7xl mx-auto h-full relative">
          {/* Sidebar overlay (MOBILE) */}
          {mobile && sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <aside
                className="fixed left-0 w-full bg-gray-900/50 z-50 flex flex-col border-r border-gray-800 backdrop-blur"
                style={{
                  top: 'max(96px, calc(96px + env(safe-area-inset-top)))',
                  height: 'calc(100vh - max(96px, calc(96px + env(safe-area-inset-top))) - env(safe-area-inset-bottom))',
                  maxWidth: "95vw",
                  boxShadow: "0 0 24px 0 rgba(0,0,0,0.48)",
                }}
              >
                <div className="flex-shrink-0 flex flex-col border-b border-gray-800 bg-gray-900/50">
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <span className="text-lg font-bold text-white">Chats</span>
                    <Button
                      variant="primary"
                      className="py-1 px-3 text-sm ml-2"
                      onClick={() => {
                        startNewChat();
                        setSidebarOpen(false);
                      }}
                      disabled={loading}
                    >
                      + New Chat
                    </Button>
                    <Button
                      variant="secondary"
                      className="ml-2 text-xl flex items-center justify-center !px-3 !py-1.5"
                      style={{ minWidth: "32px", minHeight: "32px", borderRadius: "100%" }}
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Close sidebar"
                    >
                      ×
                    </Button>
                  </div>
                  <div className="px-4 pb-2">
                    <input
                      type="search"
                      className="w-full p-2 rounded bg-gray-900/50 border border-gray-800 text-white"
                      placeholder="Search chats"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                  <ul>
                    {chats.length === 0 && (
                      <div className="text-gray-400 mt-8 text-center">No chats found.</div>
                    )}
                    {chats.map((chat) => (
                      <li
                        key={chat.chatId}
                        className={`cursor-pointer px-3 py-2 my-1 rounded-lg text-[15px] truncate transition ${
                          activeChat?.chatId === chat.chatId
                            ? "bg-orange-500 text-white"
                            : "hover:bg-gray-900/70 text-gray-100"
                        }`}
                        onClick={() => {
                          handleSelectChat(chat.chatId);
                          setSidebarOpen(false);
                        }}
                      >
                        {chat.title}
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="flex-shrink-0 px-4 pb-4 pt-2">
                  {user && (
                    <div className="bg-gray-900/50 rounded-lg text-sm text-gray-300 py-2 px-3 w-full text-center font-semibold border border-gray-800">
                      {user.name || "User"}
                    </div>
                  )}
                </div>
              </aside>
            </>
          )}
          {mobile && !sidebarOpen && (
            <Button
              variant="primary"
              className="fixed left-3 rounded-full w-10 h-10 flex items-center justify-center z-50 text-xl !p-0"
              style={{ 
                minWidth: 0, 
                minHeight: 0,
                top: 'max(96px, calc(96px + env(safe-area-inset-top)))'
              }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </Button>
          )}
          {(!mobile || (mobile && !sidebarOpen)) && (
            <aside className="bg-gray-900/50 border-r border-gray-800 flex-col w-72 lg:w-64 h-full z-30 transition duration-300 hidden lg:flex backdrop-blur">
              <div className="flex-shrink-0 flex flex-col border-b border-gray-800 bg-gray-900/50">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <span className="text-lg font-bold text-white">Chats</span>
                  <Button
                    variant="primary"
                    className="py-1 px-3 text-sm ml-2"
                    onClick={startNewChat}
                    disabled={loading}
                  >
                    + New Chat
                  </Button>
                </div>
                <div className="px-4 pb-2">
                  <input
                    type="search"
                    className="w-full p-2 rounded bg-gray-900/50 border border-gray-800 text-white"
                    placeholder="Search chats"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto px-2 custom-scrollbar">
                <ul>
                  {chats.length === 0 && (
                    <div className="text-gray-400 mt-8 text-center">No chats found.</div>
                  )}
                  {chats.map((chat) => (
                    <li
                      key={chat.chatId}
                      className={`cursor-pointer px-3 py-2 my-1 rounded-lg text-[15px] truncate transition ${
                        activeChat?.chatId === chat.chatId
                          ? "bg-orange-500 text-white"
                          : "hover:bg-gray-900/70 text-gray-100"
                      }`}
                      onClick={() => handleSelectChat(chat.chatId)}
                    >
                      {chat.title}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex-shrink-0 px-4 pb-4 pt-2">
                {user && (
                  <div className="bg-gray-900/50 rounded-lg text-sm text-gray-300 py-2 px-3 w-full text-center font-semibold border border-gray-800">
                    {user.name || "User"}
                  </div>
                )}
              </div>
            </aside>
          )}
          <section className="flex-1 flex flex-col justify-end min-h-0 bg-gray-900/50 rounded-lg ml-0 lg:ml-4 shadow-lg relative h-full border border-gray-800 backdrop-blur">
            <div
              ref={chatWindowRef}
              className={`flex-1 overflow-y-auto px-3 pt-6 pb-2 custom-scrollbar ${
                mobile && sidebarOpen ? "opacity-30 pointer-events-none" : ""
              }`}
              style={{ minHeight: 0, filter: mobile && sidebarOpen ? "blur(1px)" : "none" }}
            >
              {!activeChat?.messages?.length ? (
                <div className="text-gray-400 text-center mt-20 text-2xl font-semibold">
                  What can I help with?
                </div>
              ) : (
                activeChat.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}
                  >
                    <div
                      className="max-w-[85%] px-4 py-3 rounded-lg text-base bg-gray-900/50 text-gray-100 border border-gray-800"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        borderBottomRightRadius: msg.role === "user" ? "0.6rem" : "",
                        borderBottomLeftRadius: msg.role !== "user" ? "0.6rem" : "",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <form
              className={`w-full flex gap-2 px-3 bg-gray-900/50 border-t border-gray-800 items-center ${
                mobile && sidebarOpen ? "opacity-30 pointer-events-none" : ""
              }`}
              style={{ 
                zIndex: 2, 
                filter: mobile && sidebarOpen ? "blur(1px)" : "none",
                paddingTop: '12px',
                paddingBottom: 'max(12px, calc(12px + env(safe-area-inset-bottom)))'
              }}
              onSubmit={sendMessage}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={messageInput}
                placeholder="Type your question..."
                className="flex-1 resize-none rounded-lg p-3 bg-gray-900/50 text-white border border-gray-800 focus:border-orange-500 placeholder-gray-400"
                autoFocus
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={loading || (mobile && sidebarOpen)}
                style={{
                  minHeight: "44px",
                  maxHeight: "264px",
                }}
              />
              <Button
                type="submit"
                variant="gradient"
                disabled={loading || !messageInput.trim() || (mobile && sidebarOpen)}
                className="px-6 py-3"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
