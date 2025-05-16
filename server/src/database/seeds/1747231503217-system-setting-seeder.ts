import { SystemSettingEntity } from '@/api/system/setting/entities/system-setting.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class SystemSettingSeeder1747231503217 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        _factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository(SystemSettingEntity);
        const isReady = await repository.findOneBy({ name: 'ready' });
        if (!isReady) {
            await repository.insert({
                name: 'ready',
                content: 'true'
            });
            await repository.insert({
                name: 'version',
                content: '1.0.0'
            });
            await repository.insert({
                name: 'allowUserSignin',
                content: 'true'
            });
        }

    }
}
