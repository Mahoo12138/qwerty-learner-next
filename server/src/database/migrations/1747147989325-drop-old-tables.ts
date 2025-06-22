import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOldTables1747147989325 implements MigrationInterface {
  name = 'DropOldTables1747147989325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 删除旧的 session 表
    await queryRunner.query(`
      ALTER TABLE "session" DROP CONSTRAINT "FK_session_user"
    `);
    await queryRunner.query(`
      DROP TABLE "session"
    `);

    // 删除旧的 api_token 表
    await queryRunner.query(`
      ALTER TABLE "api_token" DROP CONSTRAINT "FK_api_token_user"
    `);
    await queryRunner.query(`
      DROP TABLE "api_token"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 重新创建 session 表
    await queryRunner.query(`
      CREATE TABLE "session" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "hash" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_by" character varying NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_by" character varying NOT NULL,
        CONSTRAINT "PK_session_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "session"
      ADD CONSTRAINT "FK_session_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // 重新创建 api_token 表
    await queryRunner.query(`
      CREATE TABLE "api_token" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "hash" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        "last_used_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_by" character varying NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_by" character varying NOT NULL,
        CONSTRAINT "PK_api_token_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "api_token"
      ADD CONSTRAINT "FK_api_token_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }
} 