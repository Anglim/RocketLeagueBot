import path from "path";
import { IAuthConfig } from "../interfaces/IAuthConfig";
import { IBlacklistConfig } from "../interfaces/IBlacklistConfig";
import { IBotReplyConfig } from "../interfaces/IBotReplyConfig";
import { ICommentStreamConfig } from "../interfaces/ICommentStreamConfig";
import { IRedditBotConfig } from "../interfaces/IRedditBotConfig";

require('dotenv').config({ path: path.join(__dirname, `../../env/.env.${process.env.NODE_ENV}`) });

console.log(process.env.NODE_ENV);
console.log(process.env.CLIENT_ID);

const authConfig: IAuthConfig = {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    username: process.env.USERNAME!,
    password: process.env.PASSWORD!,
};

const streamConfig: ICommentStreamConfig = {
    searchTerm: 'rocket league',
    size: 500,
    pollIntervalMs: 20 * 1000,
};

const blacklistConfig: IBlacklistConfig = {
    subreddits: ['RocketLeague', 'RocketLeagueEsports'],
    comments: ['This is Rocket League!']
};

const replyConfig: IBotReplyConfig = {
    replyOptions: ['Nice shot!', 'What a save!', 'Holy cow!', 'This is Rocket League!', 'This is Rocket League!'],
};

const appconfig: IRedditBotConfig = {
    authConfig,
    streamConfig,
    blacklistConfig,
    replyConfig
};

export default appconfig;