import React, { createContext, useContext, useState, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

interface SessionData {
  _id: string;
  uid: number;
  stream_urls: {
    agora_app_id: string;
    agora_channel: string;
    agora_token: string;
    client_chat_room_url: string;
    server_chat_room_url: string;
  };
}

interface Message {
  text: string;
  isSentByMe: boolean;
}

type SendMessageRequestMode1 = {
  modeType: 1;
  question: string;
  answer: string;
}

type SendMessageRequestMode2 = {
  modeType: 2;
  question: string;
  content: string;
}

type SendMessageRequest = SendMessageRequestMode1 | SendMessageRequestMode2;

interface VideoChatContextProps {
  isVideoAvailable: boolean;
  resolution: { width: number; height: number };
  isJoined: boolean;
  messages: Message[];
  inputMessage: string;
  sending: boolean;
  connected: boolean;
  session: SessionData | null;
  messageSendTo: string;
  updateResolution: (width: number, height: number) => Promise<void>;
  joinChannel: (appid: string, channel: string, token: string, uid: number) => Promise<void>;
  leaveChannel: () => Promise<void>;
  startStreaming: () => Promise<void>;
  closeStreaming: () => Promise<void>;
  sendMessage: (params: SendMessageRequest) => Promise<void>;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  
}

const VideoChatContext = createContext<VideoChatContextProps | undefined>(undefined);

const client: IAgoraRTCClient = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

type VideoChatProviderProps = {
  children: React.ReactNode;
  openapiToken: string;
  avatarId?: string;
  openapiHost?: string;
  language?: string;
  voiceId?: string; // voiceId is now provided by the user
  voiceUrl?: string;
  videoSource?: React.RefObject<HTMLVideoElement> | string | HTMLVideoElement;
};

export const VideoChatProvider: React.FC<VideoChatProviderProps> = ({
  children,
  openapiToken,
  avatarId = 'dvp_Tristan_cloth2_1080P',
  openapiHost = 'https://openapi.akool.com',
  language = 'en',
  voiceId = 'Xb7hH8MSUJpSbSDYk0k2',
  voiceUrl = '',
  videoSource = 'akool-remote-video',
}) => {
  const [isVideoSubed, setIsVideoSubed] = useState(false);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 1080, height: 720 });
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const [messageSendTo, setMessageSendTo] = useState('');

  const updateResolution = useCallback(async (width: number, height: number) => {
    setResolution({ width, height });
  }, []);

  const onUserPublish = useCallback(async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
    const remoteTrack = await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      user.videoTrack?.play(videoSource as string);
      setIsVideoSubed(true);
    } else if (mediaType === 'audio') {
      user.audioTrack?.play();
    }
  }, []);

  const joinChannel = useCallback(
    async (appid: string, channel: string, token: string, uid: number) => {
      if (!channel) {
        channel = 'react-room';
      }

      if (isJoined) {
        await client.leave();
      }

      client.on('user-published', onUserPublish);
      client.on('exception', console.log);

      await client.join(appid, channel, token || null, uid || null);
      setIsJoined(true);
    },
    [isJoined, onUserPublish]
  );

  const leaveChannel = useCallback(async () => {
    setIsJoined(false);
    await client.leave();
  }, []);

  const createSession = useCallback(
    async (avatar_id: string) => {
      const response = await fetch(`${openapiHost}/api/open/v3/liveAvatar/session/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openapiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stream_type: 'agora',
          avatar_id,
        }),
      });
      const body = await response.json();
      if (body.code !== 1000) {
        throw new Error(body.msg);
      }
      return body.data;
    },
    [openapiHost, openapiToken]
  );

  const closeSession = useCallback(
    async (id: string) => {
      const response = await fetch(`${openapiHost}/api/open/v3/liveAvatar/session/close`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openapiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const body = await response.json();
      if (body.code !== 1000) {
        throw new Error(body.msg);
      }
      return body.data;
    },
    [openapiHost, openapiToken]
  );

  const leaveChat = useCallback(() => {
    socket?.close();
  }, [socket]);

  const closeStreaming = useCallback(async () => {
    leaveChat();
    await leaveChannel();
    if (!session) {
      console.log('session not found');
      return;
    }
    await closeSession(session._id);
    setIsVideoSubed(false);
    setSession(null);
  }, [leaveChannel, leaveChat, closeSession, session]);

  const joinChat = useCallback(
    (chatUrl: string) => {
      if (socket) {
        socket.close();
        setSocket(null);
      }

      const ws = new WebSocket(chatUrl);

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const message = event.data;
        const { type, payload } = JSON.parse(message);
        if (type === 'chat') {
          const { answer } = JSON.parse(payload);
          setMessages((prevMessages) => [...prevMessages, { text: answer, isSentByMe: false }]);
        }
      };

      ws.onclose = () => {
        setSocket(null);
        setConnected(false);
      };

      setSocket(ws);
    },
    [socket]
  );

  const startStreaming = useCallback(async () => {
    const data = await createSession(avatarId);
    setSession(data);

    const { uid, stream_urls } = data;
    const { agora_app_id, agora_channel, agora_token, client_chat_room_url, server_chat_room_url } = stream_urls;

    const parts = server_chat_room_url.split('/');
    const sendTo = parts[parts.length - 1].split('.')[0];
    setMessageSendTo(sendTo);

    await joinChannel(agora_app_id, agora_channel, agora_token, uid);
    joinChat(client_chat_room_url);
  }, [avatarId, createSession, joinChannel, joinChat]);

  const sendMessage = useCallback(async (params: SendMessageRequest) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setSending(true);
      const messageText = params.question || inputMessage;
      setMessages((prevMessages) => [...prevMessages, { text: messageText, isSentByMe: true }]);

      const prompt = params.modeType === 1 ? { from: 'url', content: '' } : { from: 'url', content: params.content || '' };

      socket.send(
        JSON.stringify({
          type: 'chat',
          to: messageSendTo,
          payload: JSON.stringify({
            message_id: `msg-${Date.now()}`,
            voice_id: voiceId,
            voice_url: voiceUrl,
            language: language,
            mode_type: params.modeType,
            prompt: prompt,
            question: params.modeType === 1 ? params.answer : params.question,
          }),
        })
      );

      setInputMessage('');
      setSending(false);
    } else {
      console.error('WebSocket is not open');
    }
  }, [socket, inputMessage, messageSendTo, voiceId, voiceUrl, language]);

  return (
    <VideoChatContext.Provider
      value={{
        isVideoAvailable: isVideoSubed,
        resolution,
        isJoined,
        messages,
        inputMessage,
        sending,
        connected,
        session,
        messageSendTo,
        updateResolution,
        joinChannel,
        leaveChannel,
        startStreaming,
        closeStreaming,
        sendMessage,
        setInputMessage,
      }}
    >
      {children}
    </VideoChatContext.Provider>
  );
};

// Hook for library consumers
export const useVideoChat = () => {
  const context = useContext(VideoChatContext);
  if (!context) {
    throw new Error('useVideoChat must be used within a VideoChatProvider');
  }
  return context;
};
