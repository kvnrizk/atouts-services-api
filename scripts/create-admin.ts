import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import * as readline from 'readline';

/**
 * CLI Script to create the initial admin user
 * Usage: npm run create:admin
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, resolve);
    });
  };

  try {
    console.log('\n=== Create Initial Admin User ===\n');

    const email = await question('Email: ');
    const fullName = await question('Full Name: ');
    const password = await question('Password (min 8 characters): ');
    const confirmPassword = await question('Confirm Password: ');

    // Validation
    if (!email || !fullName || !password) {
      console.error('\n❌ All fields are required!');
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.error('\n❌ Passwords do not match!');
      process.exit(1);
    }

    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters!');
      process.exit(1);
    }

    // Create admin user
    const user = await usersService.create(email, password, fullName, 'admin');

    console.log('\n✅ Admin user created successfully!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Role: ${user.role}\n`);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.error('\n❌ Error: This email is already registered!');
    } else {
      console.error('\n❌ Error creating admin user:', error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    await app.close();
  }
}

bootstrap();
