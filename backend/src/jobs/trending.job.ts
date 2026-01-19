import { dealService } from "@/services/deal.service";
import { CronJob } from "cron";
import dayjs from "dayjs";

export class TrendingDealsJob {
    private static readonly CRON_TIME = '0,30 * * * *';

    public static init() {
        const job = new CronJob(this.CRON_TIME, async () => {
            await this.handle();
        });

        job.start();
    }

    private static async handle() {
        const now = dayjs().format('HH:mm:ss');
        console.log(`🤖 [TrendingJob ${now}] Atualizando vitrine de ofertas...`);

        await dealService.refreshCache();
    }
}
