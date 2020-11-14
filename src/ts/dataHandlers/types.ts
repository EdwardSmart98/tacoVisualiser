

export interface transaction{
    channelId: string
    giver_uid: string
    giver_username: string
    message: string
    receiver_uid: string
    receiver_username: string
    tacos: number
    totalTeamTacos: string
    ts: string
}

export interface nodeData{
    uid : string,
    username : string
    edges : edgeData[]
}

export interface edgeData{
    node_one : nodeData,
    node_two : nodeData,
    tacos : number,
    messages : string[]
}