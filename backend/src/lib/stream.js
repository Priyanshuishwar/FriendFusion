// import { StreamChat } from "stream-chat";
// import "dotenv/config";

// const apiKey = process.env.STREAM_API_KEY;   
// const apiSecret = process.env.STREAM_API_SECRET; 

// if (!apiKey || !apiSecret) {
//     console.error("Stream API key or Secret is missing");
// }

// const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// export const upsertStreamUser = async (userData) => {
//     try {
//         await streamClient.upsertUsers([userData]);
//         return userData;
//     } catch (error) {
//         console.error("Error upserting stream user", error);
//     }
// };

// export const generateStreamToken = (userId) => {
//     try {
//         const userIdStr = userId.toString();
//         return streamClient.createToken(userIdStr);
//     } catch (error) {
//         console.error("Error generating Stream token", error);
//     }
// };

import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;   
const apiSecret = process.env.STREAM_API_SECRET; 

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    const streamUser = {
      id: userData._id?.toString() || userData.id,
      name: userData.fullName,
      image: userData.profilePic,
      bio: userData.bio,
      nativeLanguage: userData.nativeLanguage,
      learningLanguage: userData.learningLanguage,
    };

    await streamClient.upsertUser(streamUser);
    return streamUser;
  } catch (error) {
    console.error("Error upserting stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token", error);
  }
};
