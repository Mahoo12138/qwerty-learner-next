import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBioToUser1747147989326 implements MigrationInterface {
    name = 'AddBioToUser1747147989326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    }
} 