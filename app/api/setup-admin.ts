import {
  findAdminUserByEmail,
  createAdminUser,
  setAdminPassword,
} from "./local-auth";

const ADMIN_EMAIL = "admin@miniyo.store";
const ADMIN_PASSWORD = "Admin@12345";

export interface SetupAdminResult {
  success: boolean;
  message: string;
}

/**
 * Ensures admin@miniyo.store exists in the admin_users table with the
 * correct bcrypt-hashed password.  Safe to call multiple times — it
 * creates the row when absent and updates the password when present.
 */
export async function setupAdmin(): Promise<SetupAdminResult> {
  try {
    const existing = await findAdminUserByEmail(ADMIN_EMAIL);

    if (!existing) {
      await createAdminUser(ADMIN_EMAIL);
      await setAdminPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      return { success: true, message: `Admin user ${ADMIN_EMAIL} created successfully.` };
    }

    await setAdminPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    return { success: true, message: `Admin user ${ADMIN_EMAIL} password updated successfully.` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[setup-admin] Error:", err);
    return { success: false, message: `Setup failed: ${message}` };
  }
}
