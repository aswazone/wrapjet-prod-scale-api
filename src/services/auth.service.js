import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password :', error);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password :', error);
    throw new Error('Error comparing password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log(existingUser, 'existing users');

    if (existingUser.length > 0)
      throw new Error('User with this email already exists');

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User created successfully: ${newUser.email}`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user :', error);
    throw new Error('Error creating user');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isValid = await comparePassword(password, existingUser.password);
    if (!isValid) throw new Error('Invalid password');

    logger.info(`User authenticated successfully: ${existingUser.email}`);
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      created_at: existingUser.created_at,
    };
  } catch (error) {
    logger.error('Error authenticating user :', error);
    if (
      error.message === 'User not found' ||
      error.message === 'Invalid password'
    ) {
      throw error;
    }
    throw new Error('Error authenticating user');
  }
};
