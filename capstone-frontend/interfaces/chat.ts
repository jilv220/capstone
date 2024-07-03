import { IMessage } from "react-native-gifted-chat"

export interface messageFromServer{
    id:string,
    role:string,
    content:string,
    updated_at:string,
    created_at:string
}

export interface message{
    _id:string,
    text:string,
    createdAt:Date,
    user:{
        _id:string,
        name:string,
        avatar:string
    }
}

export interface conversation{
    id:string,
    title:string,
    created_at:string,
    updated_at:string,
    user_id:string
}
export interface chatProps{
    initialMessages:IMessage[],
    saveMessages:(messages:IMessage[])=>void
}