export const generateBasicAuthToken = (username: string, password: string) => {
    return `Basic ${Buffer.from(username + ":" + password).toString('base64')}`;
};

export const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
