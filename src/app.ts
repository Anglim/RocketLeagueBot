import appconfig from "./config/appconfig";
import { logger } from "./logger";
import RocketLeagueBot from "./redditbot/RocketLeagueBot";

class App {

    public start() {
        logger.info(`App started...`);
        new RocketLeagueBot(appconfig).start();
    }
}

export default App;
