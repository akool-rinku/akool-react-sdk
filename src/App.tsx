import React from 'react'
import './components/index.css'
import { ChatWidget, VideoChatProvider } from 'akool-react-sdk'
const App = () => {
  return (
    <VideoChatProvider
      openapiToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGQ5Y2Q0NzNhNjc3YjZiY2VlMzQwMSIsInVpZCI6NDc3MTU5NSwiZW1haWwiOiJyaW5rdUBha29vbC5jb20iLCJjcmVkZW50aWFsSWQiOiI2NzRlYjA2MDczYTY3N2I2YmMwYmQyMjgiLCJmaXJzdE5hbWUiOiJSaW5rdSIsImxhc3ROYW1lIjoiU2FtYW50YSIsInRlYW1faWQiOiI2NzRkOWNkNDUwNjNiZmFjMDdlNzA0YzgiLCJyb2xlX2FjdGlvbnMiOlsxLDIsMyw0LDUsNiw3LDgsOV0sImlzX2RlZmF1bHRfdGVhbSI6dHJ1ZSwiZnJvbSI6InRvTyIsInR5cGUiOiJ1c2VyIiwiaWF0IjoxNzMzOTg2MTMyLCJleHAiOjIwNDUwMjYxMzJ9.W8cRJ7EQ3GOa8z-kZdhH3Ey_BMWGfJ0aRp3uGP_28Vs'
    >
      <ChatWidget />
    </VideoChatProvider>
  )
}

export default App