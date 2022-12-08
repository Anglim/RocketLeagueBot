import axios from "axios";
import FormData from "form-data";
import _ from "lodash";
import { SnooShift } from "snooshift";
import { Comment } from "snoowrap";
import { EventEmitter } from "stream";
import { ICommentStreamConfig } from "../interfaces/ICommentStreamConfig";
import { IRedditAuthToken } from "../interfaces/IRedditAuthToken";
import { IRedditBotConfig } from "../interfaces/IRedditBotConfig";
import { logger } from "../logger";
import { generateBasicAuthToken } from "./utils";

class RedditAPI {

    private token: IRedditAuthToken;
    private config: IRedditBotConfig;
    private searchResultsFromTimestamp: number;
    private snoo: SnooShift;
    private eventEmitter: EventEmitter;

    constructor(config: IRedditBotConfig) {
        this.config = config;
        this.snoo = new SnooShift();
        this.eventEmitter = new EventEmitter();
    }

    public authenticate = async () => {

        const basicAuthToken = generateBasicAuthToken(this.config.authConfig.clientId, this.config.authConfig.clientSecret);

        const request = {
            method: 'post',
            url: `https://www.reddit.com/api/v1/access_token?grant_type=password&username=${this.config.authConfig.username}&password=${this.config.authConfig.password}`,
            headers: {
                'Authorization': basicAuthToken,
            }
        };

        const response = await axios(request);
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + response.data.expires_in);
        this.token = {
            authToken: response.data.access_token,
            expiresAt: expirationDate,
        };
    };

    public listenForNewComments = (config: ICommentStreamConfig) => {
        this.searchResultsFromTimestamp = config.startFromEpoch ? config.startFromEpoch : Math.floor(Date.now() / 1000);

        this.requestComments();
        setInterval(this.requestComments, config.pollIntervalMs);

        return this.eventEmitter;
    };

    private requestComments = () => {

        logger.info(`Searching Reddit comments after timestamp: ${this.searchResultsFromTimestamp}`);

        this.snoo.searchComments({
            q: this.config.streamConfig.searchTerm,
            size: this.config.streamConfig.size,
            after: this.searchResultsFromTimestamp
        }).then((comments) => {

            const commentsTransformed: Comment[] = (comments as Comment[]).map(c => ({
                ...c,
                id: `t1_${c.id}`
            })) as Comment[];

            if (!_.isEmpty(commentsTransformed)) {
                this.searchResultsFromTimestamp = commentsTransformed[commentsTransformed.length - 1].created_utc;
            }

            this.eventEmitter.emit('update', commentsTransformed);
        }).catch(error => {
            logger.info(`Error inside snoo: ${error}`);
        });
    };

    public sendReplyToComment = async (params: { message: string, commentId: string; }) => {

        if (!this.token || this.token.expiresAt < new Date()) {
            await this.authenticate();
        }

        const data = new FormData();
        data.append('api_type', 'json');
        data.append('text', params.message);
        data.append('thing_id', params.commentId);

        const request = {
            method: 'post',
            url: 'https://oauth.reddit.com/api/comment',
            headers: {
                'User-Agent': 'MockClient/0.1 by Me',
                Authorization: `Bearer ${this.token.authToken}`
            },
            data,
        };

        const response = await axios(request);
        logger.info(JSON.stringify(response.data));
    };
}

export default RedditAPI;