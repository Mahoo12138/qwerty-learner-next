import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDictionaryWordTable1747322161172 implements MigrationInterface {
    name = 'CreateDictionaryWordTable1747322161172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "dictionary" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "language" character varying(50) NOT NULL,
                "description" text,
                "wordCount" integer NOT NULL DEFAULT '0',
                "category" character varying(50) NOT NULL DEFAULT 'general',
                "isActive" boolean NOT NULL DEFAULT true,
                "difficulty" integer,
                "metadata" json,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_dictionary_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "word" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "word" character varying(100) NOT NULL,
                "definition" text,
                "translations" text array,
                "examples" text array,
                "pronunciation" text,
                "phoneticNotation" text,
                "audioUrl" text,
                "partOfSpeech" character varying(50),
                "synonyms" text array,
                "antonyms" text array,
                "difficulty" integer,
                "frequency" integer NOT NULL DEFAULT '0',
                "metadata" json,
                "dictionaryId" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "created_by" character varying NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_word_id" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "word"."phoneticNotation" IS '音标';
            COMMENT ON COLUMN "word"."partOfSpeech" IS '词性';
            COMMENT ON COLUMN "word"."frequency" IS '词频';
            COMMENT ON COLUMN "word"."metadata" IS '词元数据'
        `);
        await queryRunner.query(`
            ALTER TABLE "word"
            ADD CONSTRAINT "FK_18fab232a8dc44425fea1afdbbf" FOREIGN KEY ("dictionaryId") REFERENCES "dictionary"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "word" DROP CONSTRAINT "FK_18fab232a8dc44425fea1afdbbf"
        `);
        await queryRunner.query(`
            DROP TABLE "word"
        `);
        await queryRunner.query(`
            DROP TABLE "dictionary"
        `);
    }

}
