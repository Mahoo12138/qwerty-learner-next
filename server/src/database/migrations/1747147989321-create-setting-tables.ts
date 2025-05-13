import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingTables1747147989321 implements MigrationInterface {
  name = 'CreateSettingTables1747147989321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user-setting" (
                "name" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "user_id" uuid NOT NULL,
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_user_setting_name" PRIMARY KEY ("name")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "system-setting" (
                "name" character varying NOT NULL,
                "description" character varying,
                "content" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_system_setting_name" PRIMARY KEY ("name")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user-setting"
            ADD CONSTRAINT "FK_setting_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user-setting" DROP CONSTRAINT "FK_setting_user_id"
        `);
    await queryRunner.query(`
            DROP TABLE "system-setting"
        `);
    await queryRunner.query(`
            DROP TABLE "user-setting"
        `);
  }
}
