import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
    constructor(private readonly statisticService: StatisticService) {}

    @Get('dashboard/:month/:year')
    async dashboard(@Param("month") month: string, @Param("year") year: string) {
        return this.statisticService.DashboardStatistic({ month, year });
    }
}
