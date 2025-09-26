// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router'
// import userAuthUser from '../hooks/userAuthUser'
// import { useQuery } from '@tanstack/react-query'
// import { getStreamToken } from '../lib/api'

// import {
//   Chat,
//   Channel,
//   ChannelHeader,
//   MessageInput,
//   MessageList,
//   Thread,
//   Window,
// } from "stream-chat-react";

// import { StreamChat } from "stream-chat";

// import ChatLoader from '../components/ChatLoader'

// const Stream_Api_key = import.meta.env.VITE_STREAM_API_KEY

// const ChatPage = () => {
//   const { id: targetUserId } = useParams()
//   const [chatClient, setChatClient] = useState(null)
//   const [channel, setChannel] = useState(null)
//   const [loading, setLoading] = useState(true)

//   const { authUser } = userAuthUser()

//   const { data: tokenData } = useQuery({
//     queryKey: ["streamToken"],
//     queryFn: getStreamToken,
//     enabled: !!authUser, 
//   })

//   useEffect(() => {
//     const initChat = async () => {
//       if (!tokenData?.token || !authUser) return

//       try {
//         console.log("Initializing stream chat...")

//         const client = StreamChat.getInstance(Stream_Api_key)
//         await client.connectUser(
//           {
//             id: authUser._id,
//             name: authUser.fullName,
//             image: authUser.profilePic,
//           },
//           tokenData.token
//         )

//         const channelId = [authUser._id, targetUserId].sort().join("-")
//         const currChannel = client.channel("messaging", channelId, {
//           members: [authUser._id, targetUserId],
//         })
//         await currChannel.watch();

//         setChatClient(client);
//         setChannel(currChannel);
//       } catch (error) {
//         console.error("Error initializing chat:", error)
//       } 
//       finally {
//         setLoading(false)
//       }
//     }

//     initChat();

//     return () => {
//       if (chatClient) chatClient.disconnectUser()
//     }
//   }, [tokenData, authUser, targetUserId]);

//   if (loading || !chatClient || !channel) return <ChatLoader />

//   return (
//     <div className="h-[93vh]">
//       <Chat client={chatClient}>
//         <Channel channel={channel}>
//           <Window>
//             <ChannelHeader />
//             <MessageList />
//             <MessageInput focus />
//             <Thread />
//           </Window>
//         </Channel>
//       </Chat>
//     </div>
//   )
// }

// export default ChatPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import userAuthUser from "../hooks/userAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import toast from "react-hot-toast";

// ✅ Env variable (must be prefixed with VITE_ in .env file)
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = userAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const initChat = async () => {
      try {
        console.log("Initializing stream chat with API key:", STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("❌ Error initializing chat:", error);
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // ✅ Proper cleanup
    return () => {
      client.disconnectUser();
      setChatClient(null);
      setChannel(null);
    };
  }, [tokenData, authUser, targetUserId]);
  const handleVideoCall = () => {
    if(channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call.Join me here ${callUrl}`,
      })
      toast.success("Video call Link sent successfully!");
    }
  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall ={handleVideoCall}/>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
            <Thread />
          </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
