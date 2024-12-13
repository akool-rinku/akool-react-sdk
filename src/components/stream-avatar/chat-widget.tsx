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
    <div className="tw-fixed tw-bottom-4 tw-right-4 tw-z-50">
      <AnimatePresence>
        {(
          <motion.div
            initial={{ scale: 0, opacity: 0, transformOrigin: 'bottom right' }}
            animate={{ scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            
            <Card className={cn(
              "tw-w-[420px] tw-h-[600px] tw-overflow-hidden tw-flex tw-flex-col tw-shadow-xl tw-absolute tw-bottom-full tw-mb-2 tw-right-0",
              "tw-sm:tw-h-[600px]"
            )}>
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-space-y-0 tw-p-2 tw-border-b">
                <div className="tw-flex tw-items-center tw-gap-2 tw-font-semibold tw-text-sm">
                  {title || 'Akool Streaming AI'}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="tw-h-8 tw-w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="tw-h-5 tw-w-5" />
                </Button>
              </div>
              <div className="tw-flex-1 tw-overflow-y-auto tw-h-full tw-flex tw-flex-col tw-rounded-b-xl tw-overflow-hidden tw-relative">
                
              <video id="akool-remote-video" className={cn("tw-absolute tw-inset-0 tw-w-full tw-h-full tw-object-cover", {
                "tw-hidden": !isVideoAvailable
              })} autoPlay loop muted></video>
              {isVideoAvailable ? null : <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                <Loading />
              </div>}
              <CardContent className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-4 tw-z-10 tw-flex tw-flex-col tw-justify-end">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "tw-flex tw-gap-2 tw-text-sm",
                      message.isSentByMe ? "tw-flex-row-reverse" : "tw-flex-row"
                    )}
                  >
                    {!message.isSentByMe && (
                      <Avatar className="tw-h-8 tw-w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "tw-rounded-2xl tw-py-2 tw-px-4 tw-max-w-[80%]",
                        message.isSentByMe
                          ? "tw-bg-primary tw-text-primary-foreground"
                          : "tw-bg-muted"
                      )}
                    >
                      <div>{message.text}</div>
                      <div className={cn(
                        "tw-text-xs tw-mt-1",
                        message.isSentByMe 
                          ? "tw-text-primary-foreground/80"
                          : "tw-text-muted-foreground"
                      )}>
                        {/* {message.createdAt} */}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="tw-p-4 tw-border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="tw-flex tw-flex-col tw-gap-2 tw-relative"
                >
                 
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="tw-flex-1"
                  />
                   <button 
                    type="submit" 
                    className="tw-self-end tw-absolute tw-bottom-0 tw-right-0 tw-p-2 tw-h-full tw-aspect-square tw-inline-flex tw-items-center tw-justify-center"
                  >
                    <SendHorizonal className="tw-h-4 tw-w-4 tw-text-primary" />
                  </button>
                </form>
                <div className="tw-text-xs tw-text-muted-foreground tw-text-center tw-mt-2">
                Powered by <a href="https://akool.ai" className="tw-text-primary">
                <img src="/akool-logo.png" className="tw-h-4 tw-inline-block" />
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
          className="tw-h-12 tw-w-12 !tw-rounded-full tw-shadow-lg"
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isJoined) {
              startStreaming()
            }
          }}
        >
         {isOpen ? <X className="tw-h-6 tw-w-6" /> : <MessageCircle className="tw-h-6 tw-w-6" />}
        </Button>
      </motion.div>
    </div>
  )
}

