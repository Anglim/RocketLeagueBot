import FormData from 'form-data';
import RedditAPI from './RedditAPI';

describe('RedditAPI', () => {
    const config = {
        clientId: 'mock_client_id',
        clientSecret: 'mock_client_secret',
        username: 'mock_username',
        password: 'mock_password',
    };

    const commentStreamConfig = {
        q: 'mock_q',
        size: 100,
        pollIntervalMs: 1000,
    };

    const mockFormData = new FormData();
    mockFormData.append('api_type', 'json');
    mockFormData.append('text', 'mock_message');
    mockFormData.append('thing_id', 'mock_comment_id');

    let redditAPI: RedditAPI;

    beforeEach(() => {
        jest.mock("axios");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should listen for new comments and emit update events', () => {
        const eventEmitter = redditAPI.listenForNewComments(commentStreamConfig);
        expect(eventEmitter.listenerCount('update')).toBeGreaterThan(0);
    });

    it('should send a reply to a comment', async () => {
        await redditAPI.sendReplyToComment({
            message: 'mock_message',
            commentId: 'mock_comment_id',
        });
    });
});