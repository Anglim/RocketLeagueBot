import { IAuthConfig } from "./IAuthConfig";
import { IBlacklistConfig } from "./IBlacklistConfig";
import { IBotReplyConfig } from "./IBotReplyConfig";
import { ICommentStreamConfig } from "./ICommentStreamConfig";

export interface IRedditBotConfig {
    authConfig: IAuthConfig;
    streamConfig: ICommentStreamConfig;
    blacklistConfig: IBlacklistConfig;
    replyConfig: IBotReplyConfig;
}