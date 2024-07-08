import { Conf } from '@/config.ts';
import { type Insertable, Kysely, PostgresDialect, sql } from 'kysely';
import type { DB, Resource, ResourceArticle, ResourcePhoneNumber, Scenario } from 'kysely-codegen';
import { Pool } from 'pg';
import { v7 as uuidv7 } from 'uuid';

async function seedResources(db: Kysely<DB>): Promise<void> {
  // Generate fake data and seed them
  const resourceCategories: Insertable<Resource>[] = [
    { name: 'depression' },
    { name: 'anxiety' },
    { name: 'suicide' },
    { name: 'older_adults' },
    { name: 'substance_use' },
  ];

  // Insert resource categories
  for (const category of resourceCategories) {
    await db
      .insertInto('resource')
      .values(category)
      .onConflict((oc) => oc.column('name').doUpdateSet(category))
      .execute();
  }

  const resourcePhoneNumbers: Insertable<ResourcePhoneNumber>[] = [
    {
      id: uuidv7(),
      phone_number: '800-273-8255',
      description: 'Suicide prevention hotline',
      resource_name: 'suicide',
    },
    {
      id: uuidv7(),
      phone_number: '800-950-6264',
      description: 'Mental health hotline',
      resource_name: 'depression',
    },
    {
      id: uuidv7(),
      phone_number: '800-662-4357',
      description: 'Substance abuse hotline',
      resource_name: 'substance_use',
    },
    {
      id: uuidv7(),
      phone_number: '877-726-4727',
      description: 'Support for older adults',
      resource_name: 'older_adults',
    },
    {
      id: uuidv7(),
      phone_number: '800-273-8256',
      description: 'Anxiety support hotline',
      resource_name: 'anxiety',
    },
  ];

  // Insert resource phone numbers
  for (const phoneNumber of resourcePhoneNumbers) {
    await db
      .insertInto('resource_phone_number')
      .values(phoneNumber)
      .onConflict((oc) => oc.column('phone_number').doUpdateSet(phoneNumber))
      .execute();
  }

  // Sample resource articles
  const resourceArticles: Insertable<ResourceArticle>[] = [
    {
      id: uuidv7(),
      title: 'Understanding Depression',
      content: 'Comprehensive guide on understanding and managing depression...',
      resource_name: 'depression',
    },
    {
      id: uuidv7(),
      title: 'Coping with Anxiety',
      content: 'Effective techniques and tips for coping with anxiety...',
      resource_name: 'anxiety',
    },
    {
      id: uuidv7(),
      title: 'Suicide Prevention Strategies',
      content: 'Important information and strategies for suicide prevention...',
      resource_name: 'suicide',
    },
    {
      id: uuidv7(),
      title: 'Mental Health Support for Older Adults',
      content: 'Resources and support for the mental health of older adults...',
      resource_name: 'older_adults',
    },
    {
      id: uuidv7(),
      title: 'Substance Use and Mental Health',
      content: 'Understanding the link between substance use and mental health...',
      resource_name: 'substance_use',
    },
  ];

  // Insert resource articles
  for (const article of resourceArticles) {
    await db
      .insertInto('resource_article')
      .values(article)
      .onConflict((oc) => oc.column('id').doUpdateSet(article))
      .execute();
  }
}

async function seed(db: Kysely<DB>): Promise<void> {
  const scenarioSeedData: Insertable<Scenario>[] = [
    {
      name: 'bad_habits',
    },
    { name: 'beauty' },
    { name: 'chores' },
    { name: 'food' },
    { name: 'health' },
    { name: 'hobbies' },
    { name: 'period_symptoms' },
    { name: 'places' },
    { name: 'productivity' },
    { name: 'romance' },
    { name: 'school' },
    { name: 'sleep' },
    { name: 'social' },
    { name: 'weather' },
    { name: 'work' },
  ];

  for (const data of scenarioSeedData) {
    await db
      .insertInto('scenario')
      .values(data)
      .onConflict((oc) => oc.column('name').doUpdateSet(data))
      .execute();
  }
}

async function main() {
  const pool = new Pool({ connectionString: Conf.DATABASE_URL });
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });

  try {
    console.log('seeding database...');
    await Promise.all([seed(db), seedResources(db)]);
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  } finally {
    await db.destroy();
  }

  console.log('database seeded successfully');
}

main();
