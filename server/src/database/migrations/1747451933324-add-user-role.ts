import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1747451933324 implements MigrationInterface {
    name = 'AddUserRole1747451933324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "bio" TO "role"
        `);
        await queryRunner.query(`
            CREATE TABLE "user_dictionary_collection" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "dictionaryId" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "UQ_bf25691875ed350910b44211b1c" UNIQUE ("userId", "dictionaryId"),
                CONSTRAINT "PK_user_dictionary_collection_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('host', 'admin', 'user')
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'
        `);
        await queryRunner.query(`
            ALTER TABLE "user_dictionary_collection"
            ADD CONSTRAINT "FK_60f45547360363c08c71ba2a9d5" FOREIGN KEY ("dictionaryId") REFERENCES "dictionary"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_dictionary_collection" DROP CONSTRAINT "FK_60f45547360363c08c71ba2a9d5"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "role"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "role" character varying NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            DROP TABLE "user_dictionary_collection"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "role" TO "bio"
        `);
    }

}
