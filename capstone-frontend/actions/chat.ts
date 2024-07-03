import { conversation, message, messageFromServer } from "@/interfaces/chat";
import ky from '@/lib/kySingleton';

export async function getConversation(){
    return await ky.getInstance().get('user/conversation').json<conversation[]>();
}

export async function createConversation(){
    return await ky.getInstance().post('user/conversation').json<conversation>();
}

export async function sendMessage(conversationId:string,message:string){
    return await ky.getInstance().post(`user/conversation/${conversationId}`,{json:{message}}).json<message>();
}

export async function getAllMessages(conversationId:string){
    return await ky.getInstance().get(`user/conversation/${conversationId}`).json<messageFromServer[]>();
}
// export interface message{
//     _id:string,
//     text:string,
//     createdAt:Date,
//     user:{
//         _id:string,
//         name:string,
//         avatar:string
//     }
// }

export function convertConversation(messageFromServer:messageFromServer[]):message[]{
    return messageFromServer.map((message)=>{
        return{
            _id:message.id,
            text:message.content,
            createdAt:new Date(message.created_at),
            user:{
            _id:message.role==='user'?1:2,
            name:message.role==='user'?'ivy':'Chatty',
            avatar:message.role==='user'?require('../assets/images/user_avatar.png'):require('../assets/images/ai_avatar.png')
            }
        }
    })
}

