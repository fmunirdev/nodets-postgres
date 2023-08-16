import User from '../models/user';

export async function seedSuperuser() {
  const email = process.env.SU_USERNAME || 'superuser@example.com';
  const password = process.env.SU_PASSWORD || 'SandMan@123';

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name: 'Super User',
      email,
      password,
    },
  });

  if (created) {
    console.log(`User created: ${user.email}`);
  }
}
