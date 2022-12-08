import Snoowrap from "snoowrap";
import _ from 'lodash';
import RedditAPI from "../redditApi/RedditAPI";
import { sleep } from "../redditApi/utils";
import { IRedditBotConfig } from "../interfaces/IRedditBotConfig";
import { logger } from "../logger";

class RocketLeagueBot {

    private redditAPI: RedditAPI;
    private config: IRedditBotConfig;

    constructor(config: IRedditBotConfig) {
        this.config = config;
    }

    public start = async () => {

        this.redditAPI = new RedditAPI(this.config);

        await this.redditAPI.authenticate();

        this.redditAPI.listenForNewComments(this.config.streamConfig).on('update', this.handleComments)
            .on('error', (err) => {
                logger.info(err);
            });
    };

    private handleComments = async (comments: Snoowrap.Comment[]) => {

        for (const comment of comments) {
            this.handleComment(comment);
            await sleep(30 * 1000); // Ensure 30 secs between replies
        }
    };

    private handleComment = async (comment: Snoowrap.Comment) => {

        if (this.isCommentBlacklisted(comment)) { return; }

        const reply = this.generateReply();

        try {
            this.redditAPI.sendReplyToComment({ message: reply, commentId: comment.id });
        } catch (err) {
            logger.info(err);
        }
    };

    private generateReply = () => {

        const { replyOptions } = this.config.replyConfig;

        if (_.isEmpty(replyOptions)) {
            throw new Error('At least one reply option must be supplied');
        }

        return _.shuffle(replyOptions)[0];
    };

    private isCommentBlacklisted = (comment: Snoowrap.Comment) => {

        const { blacklistConfig } = this.config;

        if (blacklistConfig.comments.includes(comment.body)) { return true; }
        // @ts-ignore
        if (blacklistConfig.subreddits.includes(comment.subreddit as string)) { return true; }

        return false;
    };
}

export default RocketLeagueBot;