export interface ICommentStreamConfig {
    pollIntervalMs: number;
    startFromEpoch?: number;
    searchTerm?: string;
    ids?: string;
    size?: number;
    fields?: string;
    sort?: string;
    aggs?: string[];
    author?: string;
    subreddit?: string;
    before?: number | string;
    frequency?: string;
    metadata?: boolean;
}