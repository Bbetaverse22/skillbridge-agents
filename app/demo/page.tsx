import { SanitizerDemo } from "@/components/sanitizer/sanitizer-demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sanitizer Agent Demo</h1>
            <p className="text-muted-foreground">
              Test the security sanitization engine with various types of sensitive data
            </p>
          </div>
          
          <SanitizerDemo />
        </div>
      </div>
    </div>
  );
}
