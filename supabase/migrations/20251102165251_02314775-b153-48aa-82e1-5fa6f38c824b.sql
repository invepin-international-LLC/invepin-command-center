-- Ensure trigger is set up on auth.users table to create user_security records
-- First drop the trigger if it exists to avoid errors
DROP TRIGGER IF EXISTS on_auth_user_created_security ON auth.users;

-- Create trigger to automatically create user_security record when user signs up
CREATE TRIGGER on_auth_user_created_security
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_security();