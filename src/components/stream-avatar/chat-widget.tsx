import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, SendHorizonal, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useVideoChat } from '.'
import Loading from '../ui/loading'



export default function ChatWidget({ title, personality }:{
  title?: string,
  personality?: string

}) {
  const { sendMessage, startStreaming, closeStreaming, isVideoAvailable, messages, inputMessage, setInputMessage, isJoined } = useVideoChat()
  const [isOpen, setIsOpen] = useState(false)


  useEffect(() => {
    
    if (!isOpen && isJoined) {
      let t = setTimeout(() => {
        closeStreaming()
      }, 30 * 1000)
      return () => clearTimeout(t)
    }
  }, [isOpen, isJoined])


  const handleSend = () => {
    if (inputMessage.trim()) {
      sendMessage({
        question: inputMessage,
        modeType: 2,
        content: personality || `You are a helpful assistant.`,
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, transformOrigin: 'bottom right' }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            
            <Card className={cn(
              "w-[420px] h-[600px] overflow-hidden flex flex-col shadow-xl absolute bottom-full mb-2 right-0",
              "sm:h-[600px]"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2 border-b">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  {title || 'Akool Streaming AI'}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <div className="flex-1 overflow-y-auto h-full flex flex-col rounded-b-xl overflow-hidden relative">
                
              <video id="akool-remote-video" src="https://static.website-files.org/assets/videos/avatar/live/Alina_loop-1.mp4" className={cn("absolute inset-0 w-full h-full object-cover", {
                "hidden": !isVideoAvailable
              })} autoPlay loop muted></video>
              {isVideoAvailable ? null : <div className="absolute inset-0 flex items-center justify-center">
                <Loading />
              </div>}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 z-10 flex flex-col justify-end">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex gap-2 text-sm",
                      message.isSentByMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {!message.isSentByMe && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl py-2 px-4 max-w-[80%]",
                        message.isSentByMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div>{message.text}</div>
                      <div className={cn(
                        "text-xs mt-1",
                        message.isSentByMe 
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      )}>
                        {/* {message.createdAt} */}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex flex-col gap-2 relative"
                >
                 
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1"
                  />
                   <button 
                    type="submit" 
                    className="self-end absolute bottom-0 right-0 p-2 h-full aspect-square inline-flex items-center justify-center"
                  >
                    <SendHorizonal className="h-4 w-4 text-primary" />
                  </button>
                </form>
                <div className="text-xs text-muted-foreground text-center mt-2">
                Powered by <a href="https://akool.ai" className="text-primary">
                <img src="/akool-logo.png" className="h-4 inline-block" />
                </a>
                </div>
              </div>
              </div>
            </Card> 
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="icon"
          variant={isOpen ? "default" : "outline"}
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isJoined) {
              startStreaming()
            }
          }}
        >
         {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </div>
  )
}

