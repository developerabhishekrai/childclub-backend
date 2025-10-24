-- Verify user exists and check details
SELECT 
    id, 
    firstName, 
    lastName, 
    email, 
    role, 
    status, 
    schoolId,
    LEFT(password, 20) as password_start
FROM users 
WHERE email = 'aakash@yomail.com';

-- Check if user has a school
SELECT 
    u.id, 
    u.firstName, 
    u.email, 
    u.role, 
    u.status, 
    s.name as schoolName
FROM users u
LEFT JOIN schools s ON u.schoolId = s.id
WHERE u.email = 'aakash@yomail.com';

-- Count total users with school_admin role
SELECT COUNT(*) as total_school_admins
FROM users 
WHERE role = 'school_admin';

