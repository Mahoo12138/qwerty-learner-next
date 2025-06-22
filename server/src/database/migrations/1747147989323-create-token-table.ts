import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTokenTable1747147989323 implements MigrationInterface {
  name = 'CreateTokenTable1747147989323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 token_type 枚举
    await queryRunner.query(`
      CREATE TYPE "public"."token_type_enum" AS ENUM('session', 'api')
    `);

    await queryRunner.query(`
      CREATE TABLE "token" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "public"."token_type_enum" NOT NULL,
        "name" character varying(255),
        "hash" character varying(255) NOT NULL,
        "user_id" uuid NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        "last_used_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_by" character varying NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_by" character varying NOT NULL,
        CONSTRAINT "PK_token_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      ALTER TABLE "token"
      ADD CONSTRAINT "FK_token_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 创建索引
    await queryRunner.query(`
      CREATE INDEX "IDX_token_user_id" ON "token" ("user_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_token_type" ON "token" ("type")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "IDX_token_expires_at" ON "token" ("expires_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "token" DROP CONSTRAINT "FK_token_user"
    `);
    await queryRunner.query(`
      DROP TABLE "token"
    `);
    await queryRunner.query(`
      DROP TYPE "public"."token_type_enum"
    `);
  }
} 