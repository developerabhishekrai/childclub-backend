-- Reset password for existing user aakash@yomail.com
-- Using the same password hash as other users: 12345678
UPDATE users 
SET password = '$2a$12$/rEXjHp8T/PCJsVAv9eK5eTDog32ODcC360nlPUgtOjbD2y4Ww/jq'
WHERE email = 'aakash@yomail.com';

-- Also ensure the user is active
UPDATE users 
SET status = 'active'
WHERE email = 'aakash@yomail.com';

-- Check the result
SELECT id, firstName, lastName, email, role, status, schoolId 
FROM users 
WHERE email = 'aakash@yomail.com';

