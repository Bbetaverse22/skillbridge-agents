# 🔒 Security Sanitizer Agent

A Next.js application that automatically detects and sanitizes sensitive data before processing or network calls. Built with TypeScript, AI SDK 5, and modern security practices.

## ✨ Features

- **Real-time Secret Detection**: Automatically detects API keys, passwords, personal info, and more
- **Client-side Sanitization**: Strips/masks secrets before any network calls
- **Multi-layer Security**: Client-side + server-side validation
- **Visual Feedback**: Clear indicators and warnings for detected secrets
- **Interactive Demo**: Test different types of sensitive data
- **TypeScript**: Full type safety and better developer experience
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sanitizer-agent.git
   cd sanitizer-agent
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   - Main app: http://localhost:3000
   - Demo page: http://localhost:3000/demo

## 🧪 Testing

### Interactive Demo
Visit `/demo` to test the sanitizer with pre-built examples:
- API Keys (OpenAI, AWS, GitHub)
- Database connection strings
- Personal information (SSN, email, phone)
- Credit card numbers
- JWT tokens

### Manual Testing
Try typing these examples in the chat:
```
My API key is sk-1234567890abcdef1234567890abcdef1234567890abcdef
Database: mongodb://user:password123@localhost:27017/mydb
Contact: john.doe@example.com, Phone: (555) 123-4567
```

## 🔧 Configuration

### Sanitizer Settings
```typescript
const config = {
  enableMasking: true,      // Replace with [MASKED]
  enableStripping: false,   // Remove completely
  enableHashing: false,     // Replace with [HASHED_TYPE]
  maskCharacter: '*',       // Character for masking
  strictMode: true,         // Enable all detection patterns
};
```

### Environment Variables
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
SANITIZER_STRICT_MODE=true
SANITIZER_ENABLE_MASKING=true
SANITIZER_ENABLE_STRIPPING=false
```

## 🏗️ Architecture

### Data Flow
```
User Input → Real-time Detection → Sanitization → UI Feedback → API Call
     ↓              ↓                    ↓            ↓
  "My key is     [Detects API key]   [Masks key]   [Shows warning]  [Sends sanitized]
   sk-123..."    [Critical severity]  [****]       [to user]        [text to API]
```

### Components
- **SanitizerAgent**: Core detection and sanitization logic
- **SanitizerPromptInput**: Enhanced input with real-time sanitization
- **SanitizerIndicator**: Visual feedback for detected secrets
- **SanitizerDemo**: Interactive testing interface

## 🔍 Secret Detection

The agent detects various types of sensitive data:

### Critical Severity
- API Keys (OpenAI, AWS, GitHub)
- Database connection strings
- Private keys and certificates

### High Severity
- Passwords and credentials
- JWT tokens
- Credit card numbers
- Social Security Numbers

### Medium Severity
- Email addresses
- Phone numbers

### Low Severity
- IP addresses
- File paths

## 🛡️ Security Features

- **Client-side Protection**: Secrets never leave the browser in original form
- **Server-side Validation**: Double-check for leaked secrets
- **Real-time Feedback**: Immediate visual warnings
- **Transparent Logging**: See exactly what was sanitized
- **Configurable Rules**: Customize detection patterns

## 📁 Project Structure

```
sanitizer-agent/
├── app/
│   ├── api/chat/          # AI chat API endpoint
│   ├── demo/              # Interactive demo page
│   └── page.tsx           # Main chat interface
├── components/
│   ├── sanitizer/         # Sanitizer components
│   ├── chat/              # Chat interface
│   └── ui/                # UI components
├── lib/
│   └── sanitizer.ts       # Core sanitization logic
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- **Netlify**: Works with Next.js
- **Railway**: Easy deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [AI SDK](https://ai-sdk.dev/) - AI integration
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📞 Support

- Create an issue for bugs or feature requests
- Check the demo page for examples
- Review the code for implementation details

---

**⚠️ Security Notice**: This tool helps prevent accidental exposure of secrets, but always follow security best practices and never commit sensitive data to version control.