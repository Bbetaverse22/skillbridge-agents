import ChatAssistant from "@/components/chat/chat-assistant";

export default function Home() {
  return (
    <div className="h-screen bg-background flex flex-col max-w-4xl mx-auto overflow-hidden">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Security Sanitizer Agent</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically detect and sanitize secrets before processing
            </p>
          </div>
          <a
            href="/demo"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View Demo
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatAssistant />
      </div>
    </div>
  );
}
