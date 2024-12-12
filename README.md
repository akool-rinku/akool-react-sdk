# Akool SDK

A React component library for integrating AI-powered video chat avatars into your web applications.

## Features

- 🎥 Real-time AI video streaming
- 💬 Interactive chat interface
- 🎭 Customizable avatar personalities
- 🌐 WebSocket-based communication
- 🔊 Voice synthesis support
- 🎨 Tailwind-styled components

## Installation

```bash
npm install akool-react-sdk
```

## Quick Start

```tsx
import { VideoChatProvider, ChatWidget } from 'akool-react-sdk'
import 'akool-react-sdk/akool-react-sdk.css'

const App = () => {
  return (
    <VideoChatProvider openapiToken="your-openapi-token">
      <ChatWidget title="My Avatar" personality="You are a helpful assistant." />
    </VideoChatProvider>
  )
}
```

## Customization

You can customize the avatar's personality and other properties by passing props to the `ChatWidget` component.

```tsx
<ChatWidget title="My Avatar" personality="You are a helpful assistant." />
```


## API


## Components

### VideoChatProvider

The main context provider that handles video streaming and chat functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| openapiToken | string | required | Your Akool API token |
| avatarId | string | 'dvp_Tristan_cloth2_1080P' | ID of the avatar to use |
| openapiHost | string | 'https://openapi.akool.com' | API host URL |
| language | string | 'en' | Chat language |
| voiceId | string | 'Xb7hH8MSUJpSbSDYk0k2' | Voice synthesis ID |
| voiceUrl | string | '' | Custom voice URL |
| videoSource | string \| RefObject | 'akool-remote-video' | Video element reference |

### ChatWidget

A pre-built chat interface component with video display.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Akool Streaming AI' | Chat widget title |
| personality | string | 'You are a helpful assistant.' | AI personality prompt |

## Usage Examples

### Basic Implementation

```tsx
import { VideoChatProvider, ChatWidget } from 'akool-react-sdk'

const App = () => {
  return (
    <VideoChatProvider openapiToken="your-openapi-token">
      <ChatWidget title="My Avatar" personality="You are a helpful assistant." />
    </VideoChatProvider>
  )
}
```

## Advanced Usage

### Using the useVideoChat Hook

```jsx
import { useVideoChat } from 'akool-react-sdk'

function CustomChatInterface() {
  const { 
    sendMessage, 
    messages, 
    isVideoAvailable,
    startStreaming,
    closeStreaming 
  } = useVideoChat()

  // Custom implementation
}
```

### Misc
Suppose you want the avatar to speak your formatted response. You can use the `sendMessage` function to send a message to the avatar.

```jsx
sendMessage({
  question: 'your query that you gave to your llm(ChatGPT, claude, etc)',
  modeType: 1,
  answer: 'response from your llm',
})
```
this will send the response to the avatar and it will speak the response.


For using our llm, you can use the `sendMessage` function to send a message to the avatar.

```jsx
sendMessage({
  question: 'your query that you gave to your llm(ChatGPT, claude, etc)',
  modeType: 2,
  content: 'your llm prompt',
})
```

if you are implmenting your custom solution make sure to call the `closeStreaming` function when the user leaves the chat / when session ends.


## General Guidelines

1. To use the sdk, you need to have a valid openapi token. You can get the token using client id and secret which you can get from [Akool Dashboard](https://akool.com/workspace/{workspaceId}/api/credentials). Once you have the client id and secret refer to [Akool OpenAPI Documentation](https://docs.akool.io/authentication/usage#get-the-token) to get the token.

2. To use `useChat` hook, you must wrap your component with `VideoChatProvider` and pass the `openapiToken` to it.

3. If you are using `useChat` hook, you must call `closeStreaming` function when the user leaves the chat / when session ends.


## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For support, please visit [Akool AI](https://akool.com/) or create an issue in our GitHub repository.
```


